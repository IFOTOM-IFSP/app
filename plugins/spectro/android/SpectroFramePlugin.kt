package com.lucasbiazon.ifotom

import android.content.ContentProvider
import android.content.ContentValues
import android.database.Cursor
import android.graphics.Rect
import android.media.Image
import android.net.Uri
import com.facebook.proguard.annotations.DoNotStrip
import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.FrameProcessorPluginRegistry
import kotlin.math.max
import kotlin.math.min

@DoNotStrip
class SpectroFramePlugin : FrameProcessorPlugin() {
  override fun callback(frame: Frame, params: Map<String, Any>?): Any? {
    val image = try {
      frame.image
    } catch (error: Throwable) {
      return emptyList<Double>()
    } ?: return emptyList<Double>()
    val roi = clampToBounds(params, image)
    if (roi.width() <= 0 || roi.height() <= 0) {
      return emptyList<Double>()
    }

    val plane = image.planes.firstOrNull() ?: return emptyList<Double>()
    val buffer = plane.buffer
    val rowStride = plane.rowStride
    val pixelStride = plane.pixelStride

    val width = roi.width()
    val sums = DoubleArray(width)

    val limit = buffer.limit()
    val startX = roi.left
    for (row in roi.top until roi.bottom) {
      val rowOffset = row * rowStride
      for (column in 0 until width) {
        val index = rowOffset + (startX + column) * pixelStride
        if (index >= limit) continue
        val value = buffer.get(index).toInt() and 0xFF
        sums[column] += value.toDouble()
      }
    }

    return sums.toList()
  }

  companion object {
    private const val NAME = "spectro_sum_columns"

    /**
     * Ensure the plugin is registered by touching the companion object from app startup code.
     * A ContentProvider is bundled to trigger this automatically.
     */
    @JvmStatic
    fun ensureRegistered() = Unit

    init {
      FrameProcessorPluginRegistry.addFrameProcessorPlugin(NAME) { _, _ ->
        SpectroFramePlugin()
      }
    }

    private fun clampToBounds(params: Map<String, Any>?, image: Image): Rect {
      val roiMap = params?.get("roi") as? Map<*, *> ?: emptyMap<String, Any>()
      val requestedX = (roiMap["x"] as? Number)?.toInt() ?: 0
      val requestedY = (roiMap["y"] as? Number)?.toInt() ?: 0
      val requestedW = (roiMap["width"] as? Number)?.toInt() ?: image.width
      val requestedH = (roiMap["height"] as? Number)?.toInt() ?: image.height

      val left = min(max(requestedX, 0), image.width)
      val top = min(max(requestedY, 0), image.height)
      val right = min(max(left + max(requestedW, 0), left), image.width)
      val bottom = min(max(top + max(requestedH, 0), top), image.height)
      return Rect(left, top, right, bottom)
    }
  }
}

/**
 * No-op ContentProvider that forces the SpectroFramePlugin companion to initialize during
 * application startup so the frame processor is registered before it is requested.
 */
class SpectroInitProvider : ContentProvider() {
  override fun onCreate(): Boolean {
    SpectroFramePlugin.ensureRegistered()
    return true
  }

  override fun query(
    uri: Uri,
    projection: Array<out String>?,
    selection: String?,
    selectionArgs: Array<out String>?,
    sortOrder: String?
  ): Cursor? = null

  override fun getType(uri: Uri): String? = null

  override fun insert(uri: Uri, values: ContentValues?): Uri? = null

  override fun delete(uri: Uri, selection: String?, selectionArgs: Array<out String>?): Int = 0

  override fun update(
    uri: Uri,
    values: ContentValues?,
    selection: String?,
    selectionArgs: Array<out String>?
  ): Int = 0
}
