//
//  AudioDataModule.m
//  Realm
//
//  Created by Tara Wilson on 2/21/24.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(AudioDataModule, NSObject)

RCT_EXTERN_METHOD(getWaveformData:(NSString *)url resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

@end
