import subprocess, numpy as np, sys
from PIL import Image
SRC, OUT = sys.argv[1], sys.argv[2]
W,H,FPS = 1920,1080,30
SEG, XF = 60, 9                     # 2 s per photo, 0.3 s crossfade
im = Image.open(SRC).convert("RGB")
tiles=[]
for r in range(4):
    for c in range(7):
        x0=10+610*c+2; y0=10+690*r+2           # skip 10 px border (+2 px safety)
        t=im.crop((x0,y0,x0+596,y0+676))
        t.save(f"foto_{r*7+c+1:02d}.png")
        h=H; w=round(t.width*H/t.height)       # keep aspect ratio, full height
        t=t.resize((w,h),Image.LANCZOS)
        f=np.zeros((H,W,3),np.uint8); x=(W-w)//2; f[:,x:x+w]=np.asarray(t)
        tiles.append(f.astype(np.float32))
ff=subprocess.Popen(["ffmpeg","-y","-loglevel","error","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(FPS),"-i","-",
  "-c:v","libx264","-preset","slow","-crf","17","-profile:v","high","-level","4.1","-pix_fmt","yuv420p","-movflags","+faststart",OUT],stdin=subprocess.PIPE)
black=np.zeros((H,W,3),np.float32); n=0
for k,t in enumerate(tiles):
    prev = tiles[k-1] if k else black
    for i in range(SEG):
        # 0.3 s dip to black split across the cut: never two faces on screen together
        h=XF//2+1                                   # 5 frames in, 4 frames out
        if i<h: fr=t*((i+1)/(h+1))
        elif i>=SEG-(XF-h): fr=t*((SEG-i)/(XF-h+1))
        else: fr=t
        ff.stdin.write(fr.astype(np.uint8).tobytes()); n+=1
ff.stdin.close(); ff.wait(); print("frames",n,n/FPS,"s")
