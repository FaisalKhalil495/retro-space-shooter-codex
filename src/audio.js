// All tones are synthesized here. No sampled or borrowed sound assets.
export class AudioFeedback {
  constructor(){this.context=null;this.enabled=true;this.master=null;}
  unlock(){
    if(!this.enabled)return;
    try{
      if(!this.context){const Constructor=window.AudioContext||window.webkitAudioContext;if(!Constructor)return;this.context=new Constructor();this.master=this.context.createGain();this.master.gain.value=.075;this.master.connect(this.context.destination);}
      if(this.context.state==='suspended')this.context.resume().catch(()=>{});
    }catch{/* Visual feedback remains available if audio is unsupported. */}
  }
  setEnabled(enabled){this.enabled=enabled;if(this.master)this.master.gain.value=enabled ? .075 : 0;if(enabled)this.unlock();}
  suspend(){if(this.context?.state==='running')this.context.suspend().catch(()=>{});}
  tone(frequency,end,duration,type='triangle',volume=.65){
    if(!this.enabled||!this.context||this.context.state!=='running')return;
    const now=this.context.currentTime,osc=this.context.createOscillator(),gain=this.context.createGain();
    osc.type=type;osc.frequency.setValueAtTime(frequency,now);osc.frequency.exponentialRampToValueAtTime(end,now+duration);
    gain.gain.setValueAtTime(.001,now);gain.gain.linearRampToValueAtTime(volume,now+.004);gain.gain.exponentialRampToValueAtTime(.001,now+duration);
    osc.connect(gain);gain.connect(this.master);osc.start(now);osc.stop(now+duration+.01);
    osc.onended=()=>{osc.disconnect();gain.disconnect();};
  }
  play(event){
    if(event==='shot')this.tone(510,190,.055,'square',.28);
    else if(event==='destroy')this.tone(110,42,.14,'sawtooth',.55);
    else if(event==='hit')this.tone(180,48,.25,'sawtooth',.75);
    else if(event==='enemyShot')this.tone(200,95,.07,'triangle',.22);
    else if(event==='press')this.tone(380,290,.045,'triangle',.5);
    else if(event==='start'||event==='resume')this.tone(220,440,.14,'triangle',.5);
    else if(event==='complete')this.tone(290,580,.3,'triangle',.6);
    else if(event==='over')this.tone(160,60,.5,'triangle',.7);
  }
}
