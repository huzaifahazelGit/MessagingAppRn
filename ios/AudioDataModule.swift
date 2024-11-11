//
//  AudioDataModule.swift
//  Realm
//
//  Created by Tara Wilson on 2/21/24.
//

import Foundation
import UIKit
import AVFAudio

@available(iOS 13.0, *)
@objc(AudioDataModule)
class AudioDataModule: NSObject, RealmWaveformViewDelegate {
  
  var audioResolver: RCTPromiseResolveBlock?
  var finalSamples: [CGFloat] = []
  var finalSampleMax: CGFloat = 0
  
  var waveformView: RealmWaveformView = RealmWaveformView(frame: CGRect.init(x: 0, y: 0, width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height))
  

  @objc(getWaveformData:resolve:reject:)
  func getWaveformData(_ url: String, resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
    self.audioResolver = resolve;
    waveformView.delegate = self
    waveformView.audioURL = URL(string: url)
    
  }
  


  
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  func waveformViewDidLoad(_ waveformView: RealmWaveformView) {
    waveformView.renderWaveform()
  }
  
  func waveformViewDidRender(_ waveformView: RealmWaveformView) {
    
    finalSamples = waveformView.finalSamples
    finalSampleMax = waveformView.finalSampleMax
    doFinish()
  }
  
  func doFinish() {
    if let resolve = audioResolver {
      resolve(["samples": finalSamples,
               "sampleMax": finalSampleMax])
    }
  }
  
  
  
}


