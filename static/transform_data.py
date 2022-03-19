import numpy as np
import json

a = np.loadtxt("data/data.dat")
bells = a[a[:,2]==0,:]
swells = a[a[:,2]!=0,:]

labels = ["bells","swells"]
for temp, label in zip([bells,swells],labels):
  a = temp*1.0
  dt = a[1:,0]-a[:-1,0]
  a[:-1,0] = dt
  a[-1,0] = a[-2,0]

  b = [list(e) for e in a]
  with open(f"data/data_{label}.json","w") as f:
      json.dump(b,f)