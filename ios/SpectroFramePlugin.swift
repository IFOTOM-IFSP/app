import AVFoundation
import Foundation
import VisionCamera

@objc(SpectroFramePlugin)
public final class SpectroFramePlugin: FrameProcessorPlugin {
  public override func callback(_ frame: Frame!, withArguments arguments: [AnyHashable: Any]!) -> Any! {
    guard
      let frame = frame,
      let sampleBuffer = frame.buffer,
      let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer)
    else {
      return []
    }

    let roi = Self.parseROI(from: arguments)
    let width = CVPixelBufferGetWidthOfPlane(pixelBuffer, 0)
    let height = CVPixelBufferGetHeightOfPlane(pixelBuffer, 0)

    guard width > 0, height > 0 else {
      return []
    }

    CVPixelBufferLockBaseAddress(pixelBuffer, .readOnly)
    defer { CVPixelBufferUnlockBaseAddress(pixelBuffer, .readOnly) }

    guard let baseAddress = CVPixelBufferGetBaseAddressOfPlane(pixelBuffer, 0) else {
      return []
    }

    let bytesPerRow = CVPixelBufferGetBytesPerRowOfPlane(pixelBuffer, 0)

    let rx = max(0, min(roi.x, width - 1))
    let ry = max(0, min(roi.y, height - 1))
    let rw = max(1, min(roi.width, width - rx))
    let rh = max(1, min(roi.height, height - ry))

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

  private struct ROI {
    let x: Int
    let y: Int
    let width: Int
    let height: Int

    static let zero = ROI(x: 0, y: 0, width: 0, height: 0)
  }

  private static func parseROI(from arguments: [AnyHashable: Any]?) -> ROI {
    guard let arguments else { return .zero }

    if let nested = arguments["roi"] as? [AnyHashable: Any] {
      return ROI(
        x: Self.intValue(from: nested["x"]),
        y: Self.intValue(from: nested["y"]),
        width: Self.intValue(from: nested["w"]),
        height: Self.intValue(from: nested["h"])
      )
    }

    return ROI(
      x: Self.intValue(from: arguments["x"]),
      y: Self.intValue(from: arguments["y"]),
      width: Self.intValue(from: arguments["w"]),
      height: Self.intValue(from: arguments["h"])
    )
  }

  private static func intValue(from value: Any?) -> Int {
    if let number = value as? NSNumber {
      return number.intValue
    }
    if let string = value as? NSString {
      return string.integerValue
    }
    return 0
  }
}
