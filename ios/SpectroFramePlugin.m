#import <Foundation/Foundation.h>
#import <VisionCamera/FrameProcessorPlugin.h>

@interface SpectroFramePlugin : NSObject
@end

@implementation SpectroFramePlugin
VISION_EXPORT_SWIFT_FRAME_PROCESSOR(SpectroFramePlugin, spectro_sum_columns)
@end
