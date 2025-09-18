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

    if let nested = arguments["roi"] {
      if let dictionary = nested as? [AnyHashable: Any] {
        return parseROIdictionary(dictionary)
      }
      if let array = nested as? [Any] {
        return parseROIarray(array)
      }
    }

    return parseROIdictionary(arguments)
  }

  private static func parseROIdictionary(_ dictionary: [AnyHashable: Any]) -> ROI {
    let x = extract(from: dictionary, keys: ["x", "left", 0]) ?? 0
    let y = extract(from: dictionary, keys: ["y", "top", 1]) ?? 0
    let width = extract(from: dictionary, keys: ["w", "width", 2]) ?? 0
    let height = extract(from: dictionary, keys: ["h", "height", 3]) ?? 0
    return ROI(x: x, y: y, width: width, height: height)
  }

  private static func parseROIarray(_ array: [Any]) -> ROI {
    let x = intValue(from: array[safe: 0]) ?? 0
    let y = intValue(from: array[safe: 1]) ?? 0
    let width = intValue(from: array[safe: 2]) ?? 0
    let height = intValue(from: array[safe: 3]) ?? 0
    return ROI(x: x, y: y, width: width, height: height)
  }

  private static func extract(from dictionary: [AnyHashable: Any], keys: [AnyHashable]) -> Int? {
    for key in keys {
      if let value = dictionary[key], let parsed = intValue(from: value) {
        return parsed
      }
      if let numericKey = (key as? NSString)?.integerValue ?? (key as? NSNumber)?.intValue {
        if let value = dictionary[NSNumber(value: numericKey)], let parsed = intValue(from: value) {
          return parsed
        }
      }
    }
    return nil
  }

  private static func intValue(from value: Any?) -> Int? {
    if let number = value as? NSNumber {
      return number.intValue
    }
    if let string = value as? NSString {
      let trimmed = string.trimmingCharacters(in: .whitespacesAndNewlines)
      guard !trimmed.isEmpty else { return nil }
      if let doubleValue = Double(trimmed) {
        return Int(doubleValue)
      }
      return nil
    }
    return nil
  }
}

private extension Array where Element == Any {
  subscript(safe index: Int) -> Any? {
    guard indices.contains(index) else { return nil }
    return self[index]
  }
}
