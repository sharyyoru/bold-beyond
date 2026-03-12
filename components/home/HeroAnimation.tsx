"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Inline the animation data for optimal loading
const tabletAnimation = {"v":"5.8.1","fr":30,"ip":0,"op":120,"w":1600,"h":1600,"nm":"Using Tablet","ddd":0,"assets":[{"id":"comp_0","nm":"Girl","fr":30,"layers":[{"ddd":0,"ind":4,"ty":3,"nm":"C | Left_Hand","parent":24,"sr":1,"ks":{"o":{"a":0,"k":0},"r":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":42,"s":[0]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.167],"y":[0]},"t":60,"s":[-9]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":77,"s":[-9]},{"t":92,"s":[0]}]},"p":{"a":1,"k":[{"i":{"x":0.448,"y":1},"o":{"x":0.333,"y":0},"t":7,"s":[696.431,810.032,0],"to":[-0.687,15.245,0],"ti":[7.169,-3.516,0]},{"i":{"x":0.667,"y":0.667},"o":{"x":0.333,"y":0.333},"t":24,"s":[676.77,837.284,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.448,"y":1},"o":{"x":0.333,"y":0},"t":42,"s":[676.77,837.284,0],"to":[6.655,26.322,0],"ti":[0.402,-0.73,0]},{"i":{"x":0.667,"y":1},"o":{"x":0.167,"y":0},"t":60,"s":[709.336,882.189,0],"to":[-0.402,0.73,0],"ti":[0.402,-0.73,0]},{"i":{"x":0.448,"y":1},"o":{"x":0.333,"y":0},"t":77,"s":[709.336,882.189,0],"to":[-0.402,0.73,0],"ti":[0.252,-5.595,0]},{"t":92,"s":[696.431,810.032,0]}]},"a":{"a":0,"k":[50,50,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"ip":0,"op":120,"st":0,"bm":0}]}],"layers":[{"ddd":0,"ind":1,"ty":0,"nm":"Girl","refId":"comp_0","sr":1,"ks":{"o":{"a":0,"k":100},"r":{"a":0,"k":0},"p":{"a":0,"k":[800,800,0]},"a":{"a":0,"k":[800,800,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"w":1600,"h":1600,"ip":0,"op":120,"st":0,"bm":0}],"markers":[]};

export default function HeroAnimation() {
  return (
    <div className="relative w-full max-w-lg aspect-square">
      <Lottie
        animationData={tabletAnimation}
        loop={true}
        autoplay={true}
        className="w-full h-full"
        rendererSettings={{
          preserveAspectRatio: "xMidYMid meet",
        }}
      />
      
      {/* Floating branded cards with glassmorphism */}
      <div className="absolute -left-8 top-1/4 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl p-4 animate-fade-in border border-white/50">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/excellent-emoticon.svg"
            alt="Excellent"
            width={40}
            height={40}
          />
          <div>
            <p className="font-semibold text-palette-sky text-sm">Feeling Great!</p>
            <p className="text-xs text-gray-500">Wellbeing Score: 87%</p>
          </div>
        </div>
      </div>
      
      <div className="absolute -right-4 bottom-1/3 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl p-4 animate-fade-in border border-white/50">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/mandala-filled.svg"
            alt="AI Match"
            width={32}
            height={32}
          />
          <div>
            <p className="font-semibold text-palette-sky text-sm">AI Match Found</p>
            <p className="text-xs text-palette-sea">94.3% confidence</p>
          </div>
        </div>
      </div>
    </div>
  );
}
