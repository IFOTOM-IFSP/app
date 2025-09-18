import Foundation
import CoreVideo
import VisionCamera

@objcMembers
public class SpectroFramePlugin: FrameProcessorPlugin {
  public override init() {
    super.init()
  }

  public override func callback(_ pixelBuffer: CVPixelBuffer, withArgs args: [AnyHashable: Any]?) -> Any? {
    let width = CVPixelBufferGetWidth(pixelBuffer)
    let height = CVPixelBufferGetHeight(pixelBuffer)

    var rx = 0
    var ry = 0
    var rw = width
    var rh = height

    let roiValues: [String: Any]
    if let nested = args?["roi"] as? [String: Any] {
      roiValues = nested
    } else if let direct = args as? [String: Any] {
      roiValues = direct
    } else {
      roiValues = [:]
    }

    if let value = roiValues["x"] as? NSNumber { rx = value.intValue }
    if let value = roiValues["y"] as? NSNumber { ry = value.intValue }
    if let value = (roiValues["width"] ?? roiValues["w"]) as? NSNumber { rw = value.intValue }
    if let value = (roiValues["height"] ?? roiValues["h"]) as? NSNumber { rh = value.intValue }

    let left = max(0, min(rx, width))
    let top = max(0, min(ry, height))
    let right = max(left, min(left + max(rw, 0), width))
    let bottom = max(top, min(top + max(rh, 0), height))

    let roiWidth = max(0, right - left)
    let roiHeight = max(0, bottom - top)
    if roiWidth == 0 || roiHeight == 0 {
      return []
    }

    CVPixelBufferLockBaseAddress(pixelBuffer, .readOnly)
    defer { CVPixelBufferUnlockBaseAddress(pixelBuffer, .readOnly) }

    guard let baseAddress = CVPixelBufferGetBaseAddressOfPlane(pixelBuffer, 0) else {
      return []
    }
    let bytesPerRow = CVPixelBufferGetBytesPerRowOfPlane(pixelBuffer, 0)

    var sums = [Double](repeating: 0.0, count: roiWidth)
    for row in 0..<roiHeight {
      let rowPointer = baseAddress.advanced(by: (top + row) * bytesPerRow)
      let pixels = rowPointer.assumingMemoryBound(to: UInt8.self)
      for column in 0..<roiWidth {
        sums[column] += Double(pixels[left + column])
      }
    }

    return sums
  }
}

VISION_EXPORT_SWIFT_FRAME_PROCESSOR(SpectroFramePlugin, spectro_sum_columns)
