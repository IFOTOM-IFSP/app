import Foundation
import AVFoundation
import VisionCamera

@objc(SpectroFramePlugin)
public class SpectroFramePlugin: NSObject, FrameProcessorPlugin {
  public static func callback(_ frame: Frame!, withArgs args: [Any]!) -> Any! {
    guard let buffer = frame.buffer else { return [] }
    let roi = parseROI(args: args)
    let width = CVPixelBufferGetWidthOfPlane(buffer, 0)
    let height = CVPixelBufferGetHeightOfPlane(buffer, 0)

    CVPixelBufferLockBaseAddress(buffer, .readOnly)
    defer { CVPixelBufferUnlockBaseAddress(buffer, .readOnly) }

    guard let baseAddress = CVPixelBufferGetBaseAddressOfPlane(buffer, 0) else { return [] }
    let bytesPerRow = CVPixelBufferGetBytesPerRowOfPlane(buffer, 0)

    let rx = max(0, min(Int(roi.x), width - 1))
    let ry = max(0, min(Int(roi.y), height - 1))
    let rw = max(1, min(Int(roi.w), width - rx))
    let rh = max(1, min(Int(roi.h), height - ry))

    var sums = [Double](repeating: 0.0, count: rw)

    for row in ry..<(ry + rh) {
      let rowPointer = baseAddress.advanced(by: row * bytesPerRow)
      let pixels = rowPointer.assumingMemoryBound(to: UInt8.self)
      for column in 0..<rw {
        sums[column] += Double(pixels[rx + column])
      }
    }

    return sums
  }

  private static func parseROI(args: [Any]?) -> (x: Int, y: Int, w: Int, h: Int) {
    guard let values = args, values.count >= 4 else { return (0, 0, 0, 0) }
    return (
      values[0] as? Int ?? 0,
      values[1] as? Int ?? 0,
      values[2] as? Int ?? 0,
      values[3] as? Int ?? 0
    )
  }
}
