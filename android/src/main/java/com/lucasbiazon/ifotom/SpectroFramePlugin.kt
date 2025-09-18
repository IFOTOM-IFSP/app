package com.lucasbiazon.ifotom

import android.media.Image
import com.facebook.proguard.annotations.DoNotStrip
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin
import java.nio.ByteBuffer

@DoNotStrip
class SpectroFramePlugin : FrameProcessorPlugin("spectro_sum_columns") {
  override fun callback(frame: com.mrousavy.camera.frameprocessor.Frame, params: Array<out Any>?): Any? {
    val image: Image = frame.image ?: return emptyList<Double>()
    val arguments = params ?: emptyArray()
    val (rx, ry, rw, rh) = parseRoi(arguments)

    val yPlane = image.planes[0]
    val yBuffer: ByteBuffer = yPlane.buffer
    val rowStride = yPlane.rowStride
    val pixelStride = yPlane.pixelStride

    val width = image.width
    val height = image.height

    val x = rx.coerceIn(0, width - 1)
    val y = ry.coerceIn(0, height - 1)
    val w = rw.coerceIn(1, width - x)
    val h = rh.coerceIn(1, height - y)

    val sums = DoubleArray(w) { 0.0 }

    for (row in y until (y + h)) {
      val rowOffset = row * rowStride
      for (column in 0 until w) {
        val index = rowOffset + (x + column) * pixelStride
        val value = yBuffer.get(index).toInt() and 0xFF
        sums[column] += value.toDouble()
      }
    }

    return sums.toList()
  }

  private fun parseRoi(args: Array<out Any>): Quad {
    if (args.size < 4) return Quad(0, 0, 0, 0)
    return Quad(
      (args[0] as Number).toInt(),
      (args[1] as Number).toInt(),
      (args[2] as Number).toInt(),
      (args[3] as Number).toInt()
    )
  }

  data class Quad(val x: Int, val y: Int, val w: Int, val h: Int)
}
