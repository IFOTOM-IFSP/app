package com.lucasbiazon.ifotom

import com.facebook.proguard.annotations.DoNotStrip
import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.FrameProcessorPluginRegistry
import java.nio.ByteBuffer

@DoNotStrip
class SpectroFramePlugin : FrameProcessorPlugin() {
  override fun callback(frame: Frame, params: Map<String, Any>?): Any? {
    val image = try {
      frame.image
    } catch (_: Throwable) {
      return emptyList<Double>()
    } ?: return emptyList<Double>()

    val roi = parseRoi(params)
    val yPlane = image.planes[0]
    val rowStride = yPlane.rowStride
    val pixelStride = yPlane.pixelStride
    val width = image.width
    val height = image.height

    if (width <= 0 || height <= 0) return emptyList<Double>()

    val x = roi.x.coerceIn(0, width - 1)
    val y = roi.y.coerceIn(0, height - 1)
    val w = roi.width.coerceIn(1, width - x)
    val h = roi.height.coerceIn(1, height - y)

    val yBuffer: ByteBuffer = yPlane.buffer.duplicate()
    val sums = DoubleArray(w) { 0.0 }

    for (row in y until (y + h)) {
      val rowOffset = row * rowStride
      val columnOffset = x * pixelStride
      for (column in 0 until w) {
        val index = rowOffset + columnOffset + column * pixelStride
        if (index >= yBuffer.limit()) {
          break
        }
        val value = yBuffer.get(index).toInt() and 0xFF
        sums[column] += value.toDouble()
      }
    }

    return sums.toList()
  }

  private fun parseRoi(params: Map<String, Any>?): Roi {
    val container = when (val nested = params?.get("roi")) {
      is Map<*, *> -> nested
      else -> params
    }

    fun extract(key: String): Int {
      val value = container?.get(key) ?: return 0
      return when (value) {
        is Number -> value.toInt()
        is String -> value.toDoubleOrNull()?.toInt() ?: 0
        else -> 0
      }
    }

    return Roi(
      extract("x"),
      extract("y"),
      extract("w"),
      extract("h")
    )
  }

  private data class Roi(val x: Int, val y: Int, val width: Int, val height: Int)

  companion object {
    init {
      FrameProcessorPluginRegistry.addFrameProcessorPlugin("spectro_sum_columns") { _, _ ->
        SpectroFramePlugin()
      }
    }
  }
}
