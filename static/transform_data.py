import numpy as np
import json
import os 

datafiles = [f"data/{f}" for f in os.listdir("data") if f.split(".")[-1]=="dat"]

labels = ["bells","swells"]
adata = {label:[] for label in labels}
for fname in datafiles:
  a = np.loadtxt(fname)
  bells = a[a[:,2]==0,:]
  swells = a[a[:,2]!=0,:]

  for temp, label in zip([bells,swells],labels):
    a = temp*1.0
    dt = a[1:,0]-a[:-1,0]
    a[:-1,0] = dt
    a[-1,0] = a[-2,0]

    b = [list(e) for e in a]
    adata[label].extend(b)
    
for label in labels:
  with open(f"data/data_{label}.json","w") as f:
    json.dump(adata[label],f)