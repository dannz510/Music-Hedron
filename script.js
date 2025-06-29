c = document.querySelector('#c')
c.width = 1920
c.height = 1080
x = c.getContext('2d')
C = Math.cos
S = Math.sin
t = 0
T = Math.tan

rsz=window.onresize=()=>{
  setTimeout(()=>{
    if(document.body.clientWidth > document.body.clientHeight*1.77777778){
      c.style.height = '100vh'
      setTimeout(()=>c.style.width = c.clientHeight*1.77777778+'px',0)
    }else{
      c.style.width = '100vw'
      setTimeout(()=>c.style.height =     c.clientWidth/1.77777778 + 'px',0)
    }
  },0)
}
rsz()

async function Draw(){
  
  if(!t){
    R=(Rl,Pt,Yw,m)=>{
      M=Math
      A=M.atan2
      H=M.hypot
      X=S(p=A(X,Z)+Yw)*(d=H(X,Z))
      Z=C(p)*d
      Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z))
      Z=C(p)*d
      X=S(p=A(X,Y)+Rl)*(d=H(X,Y))
      Y=C(p)*d
      if(m){
        X+=oX
        Y+=oY
        Z+=oZ
      }
    }
    Q=()=>[c.width/2+X/Z*700,c.height/2+Y/Z*700]
    I=(A,B,M,D,E,F,G,H)=>(K=((G-E)*(B-F)-(H-F)*(A-E))/(J=(H-F)*(M-A)-(G-E)*(D-B)))>=0&&K<=1&&(L=((M-A)*(B-F)-(D-B)*(A-E))/J)>=0&&L<=1?[A+K*(M-A),B+K*(D-B)]:0
    
    Rn = Math.random
    
    async function loadOBJ(url, scale, tx, ty, tz, rl, pt, yw) {
      let res
      await fetch(url, res => res).then(data=>data.text()).then(data=>{
        a=[]
        data.split("\nv ").map(v=>{
          a=[...a, v.split("\n")[0]]
        })
        a=a.filter((v,i)=>i).map(v=>[...v.split(' ').map(n=>(+n.replace("\n", '')))])
        ax=ay=az=0
        a.map(v=>{
          v[1]*=-1
          ax+=v[0]
          ay+=v[1]
          az+=v[2]
        })
        ax/=a.length
        ay/=a.length
        az/=a.length
        a.map(v=>{
          X=(v[0]-ax)*scale
          Y=(v[1]-ay)*scale
          Z=(v[2]-az)*scale
          R2(rl,pt,yw,0)
          v[0]=X
          v[1]=Y
          v[2]=Z
        })
        maxY=-6e6
        a.map(v=>{
          if(v[1]>maxY)maxY=v[1]
        })
        a.map(v=>{
          v[1]-=maxY-oY
          v[0]+=tx
          v[1]+=ty
          v[2]+=tz
        })

        b=[]
        data.split("\nf ").map(v=>{
          b=[...b, v.split("\n")[0]]
        })
        b.shift()
        b=b.map(v=>v.split(' '))
        b=b.map(v=>{
          v=v.map(q=>{
            return +q.split('/')[0]
          })
          v=v.filter(q=>q)
          return v
        })
        
        res=[]
        b.map(v=>{
          e=[]
          v.map(q=>{
            e=[...e, a[q-1]]
          })
          e = e.filter(q=>q)
          res=[...res, e]
        })
      })
      return res
    }

    geoSphere = (mx, my, mz, iBc, size) => {
      let collapse=0
      let B=Array(iBc).fill().map(v=>{
        X = Rn()-.5
        Y = Rn()-.5
        Z = Rn()-.5
        return  [X,Y,Z]
      })
      for(let m=150;m--;){
        B.map((v,i)=>{
          X = v[0]
          Y = v[1]
          Z = v[2]
          B.map((q,j)=>{
            if(j!=i){
              X2=q[0]
              Y2=q[1]
              Z2=q[2]
              d=1+(Math.hypot(X-X2,Y-Y2,Z-Z2)*(3+iBc/40)*3)**4
              X+=(X-X2)*1e3/d
              Y+=(Y-Y2)*1e3/d
              Z+=(Z-Z2)*1e3/d
            }
          })
          d=Math.hypot(X,Y,Z)
          v[0]=X/d
          v[1]=Y/d
          v[2]=Z/d
          if(collapse){
            d=25+Math.hypot(X,Y,Z)
            v[0]=(X-X/d)/1.1
            v[1]=(Y-Y/d)/1.1         
            v[2]=(Z-Z/d)/1.1
          }
        })
      }
      mind = 6e6
      B.map((v,i)=>{
        X1 = v[0]
        Y1 = v[1]
        Z1 = v[2]
        B.map((q,j)=>{
          X2 = q[0]
          Y2 = q[1]
          Z2 = q[2]
          if(i!=j){
            d = Math.hypot(a=X1-X2, b=Y1-Y2, e=Z1-Z2)
            if(d<mind) mind = d
          }
        })
      })
      a = []
      B.map((v,i)=>{
        X1 = v[0]
        Y1 = v[1]
        Z1 = v[2]
        B.map((q,j)=>{
          X2 = q[0]
          Y2 = q[1]
          Z2 = q[2]
          if(i!=j){
            d = Math.hypot(X1-X2, Y1-Y2, Z1-Z2)
            if(d<mind*2){
              if(!a.filter(q=>q[0]==X2&&q[1]==Y2&&q[2]==Z2&&q[3]==X1&&q[4]==Y1&&q[5]==Z1).length) a = [...a, [X1*size,Y1*size,Z1*size,X2*size,Y2*size,Z2*size]]
            }
          }
        })
      })
      B.map(v=>{
        v[0]*=size
        v[1]*=size
        v[2]*=size
        v[0]+=mx
        v[1]+=my
        v[2]+=mz
      })
      return [mx, my, mz, size, B, a]
    }

    lineFaceI = (X1, Y1, Z1, X2, Y2, Z2, facet, autoFlipNormals=false, showNormals=false) => {
      let X_, Y_, Z_, d, m, l_,K,J,L,p
      let I_=(A,B,M,D,E,F,G,H)=>(K=((G-E)*(B-F)-(H-F)*(A-E))/(J=(H-F)*(M-A)-(G-E)*(D-B)))>=0&&K<=1&&(L=((M-A)*(B-F)-(D-B)*(A-E))/J)>=0&&L<=1?[A+K*(M-A),B+K*(D-B)]:0
      let Q_=()=>[c.width/2+X_/Z_*600,c.height/2+Y_/Z_*600]
      let R_ = (Rl,Pt,Yw,m)=>{
        let M=Math, A=M.atan2, H=M.hypot
        X_=S(p=A(X_,Y_)+Rl)*(d=H(X_,Y_)),Y_=C(p)*d,X_=S(p=A(X_,Z_)+Yw)*(d=H(X_,Z_)),Z_=C(p)*d,Y_=S(p=A(Y_,Z_)+Pt)*(d=H(Y_,Z_)),Z_=C(p)*d
        if(m){ X_+=oX,Y_+=oY,Z_+=oZ }
      }
      let rotSwitch = m =>{
        switch(m){
          case 0: R_(0,0,Math.PI/2); break
          case 1: R_(0,Math.PI/2,0); break
          case 2: R_(Math.PI/2,0,Math.PI/2); break
        }        
      }
      let ax = 0, ay = 0, az = 0
      facet.map(q_=>{ ax += q_[0], ay += q_[1], az += q_[2] })
      ax /= facet.length, ay /= facet.length, az /= facet.length
      let b1 = facet[2][0]-facet[1][0], b2 = facet[2][1]-facet[1][1], b3 = facet[2][2]-facet[1][2]
      let c1 = facet[1][0]-facet[0][0], c2 = facet[1][1]-facet[0][1], c3 = facet[1][2]-facet[0][2]
      let crs = [b2*c3-b3*c2,b3*c1-b1*c3,b1*c2-b2*c1]
      d = Math.hypot(...crs)+.001
      let nls = 1 //normal line length
      crs = crs.map(q=>q/d*nls)
      let X1_ = ax, Y1_ = ay, Z1_ = az
      let flip = 1
      if(autoFlipNormals){
        let d1_ = Math.hypot(X1_-X1,Y1_-Y1,Z1_-Z1)
        let d2_ = Math.hypot(X1-(ax + crs[0]/99),Y1-(ay + crs[1]/99),Z1-(az + crs[2]/99))
        flip = d2_>d1_?-1:1
      }
      let X2_ = ax + (crs[0]*=flip), Y2_ = ay + (crs[1]*=flip), Z2_ = az + (crs[2]*=flip)
      if(showNormals){
        x.beginPath()
        X_ = X1_, Y_ = Y1_, Z_ = Z1_
        R_(Rl,Pt,Yw,1)
        if(Z_>0) x.lineTo(...Q_())
        X_ = X2_, Y_ = Y2_, Z_ = Z2_
        R_(Rl,Pt,Yw,1)
        if(Z_>0) x.lineTo(...Q_())
        x.lineWidth = 5
        x.strokeStyle='#f004'
        x.stroke()
      }
      
      let p1_ = Math.atan2(X2_-X1_,Z2_-Z1_)
      let p2_ = -(Math.acos((Y2_-Y1_)/(Math.hypot(X2_-X1_,Y2_-Y1_,Z2_-Z1_)+.001))+Math.PI/2)
      let isc = false, iscs = [false,false,false]
      X_ = X1, Y_ = Y1, Z_ = Z1
      R_(0,-p2_,-p1_)
      let rx_ = X_, ry_ = Y_, rz_ = Z_
      for(let m=3;m--;){
        if(isc === false){
          X_ = rx_, Y_ = ry_, Z_ = rz_
          rotSwitch(m)
          X1_ = X_, Y1_ = Y_, Z1_ = Z_ = 5, X_ = X2, Y_ = Y2, Z_ = Z2
          R_(0,-p2_,-p1_)
          rotSwitch(m)
          X2_ = X_, Y2_ = Y_, Z2_ = Z_
          facet.map((q_,j_)=>{
            if(isc === false){
              let l = j_
              X_ = facet[l][0], Y_ = facet[l][1], Z_ = facet[l][2]
              R_(0,-p2_,-p1_)
              rotSwitch(m)
              let X3_=X_, Y3_=Y_, Z3_=Z_
              l = (j_+1)%facet.length
              X_ = facet[l][0], Y_ = facet[l][1], Z_ = facet[l][2]
              R_(0,-p2_,-p1_)
              rotSwitch(m)
              let X4_ = X_, Y4_ = Y_, Z4_ = Z_
              if(l_=I_(X1_,Y1_,X2_,Y2_,X3_,Y3_,X4_,Y4_)) iscs[m] = l_
            }
          })
        }
      }
      if(iscs.filter(v=>v!==false).length==3){
        let iscx = iscs[1][0], iscy = iscs[0][1], iscz = iscs[0][0]
        let pointInPoly = true
        ax=0, ay=0, az=0
        facet.map((q_, j_)=>{ ax+=q_[0], ay+=q_[1], az+=q_[2] })
        ax/=facet.length, ay/=facet.length, az/=facet.length
        X_ = ax, Y_ = ay, Z_ = az
        R_(0,-p2_,-p1_)
        X1_ = X_, Y1_ = Y_, Z1_ = Z_
        X2_ = iscx, Y2_ = iscy, Z2_ = iscz
        facet.map((q_,j_)=>{
          if(pointInPoly){
            let l = j_
            X_ = facet[l][0], Y_ = facet[l][1], Z_ = facet[l][2]
            R_(0,-p2_,-p1_)
            let X3_ = X_, Y3_ = Y_, Z3_ = Z_
            l = (j_+1)%facet.length
            X_ = facet[l][0], Y_ = facet[l][1], Z_ = facet[l][2]
            R_(0,-p2_,-p1_)
            let X4_ = X_, Y4_ = Y_, Z4_ = Z_
            if(I_(X1_,Y1_,X2_,Y2_,X3_,Y3_,X4_,Y4_)) pointInPoly = false
          }
        })
        if(pointInPoly){
          X_ = iscx, Y_ = iscy, Z_ = iscz
          R_(0,p2_,0)
          R_(0,0,p1_)
          isc = [[X_,Y_,Z_], [crs[0],crs[1],crs[2]]]
        }
      }
      return isc
    }
    
    Cylinder = (rw,cl,ls1,ls2) => {
      let a = []
      for(let i=rw;i--;){
        let b = []
        for(let j=cl;j--;){
          X = S(p=Math.PI*2/cl*j) * ls1
          Y = (1/rw*i-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
        }
        //a = [...a, b]
        for(let j=cl;j--;){
          b = []
          X = S(p=Math.PI*2/cl*j) * ls1
          Y = (1/rw*i-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*(j+1)) * ls1
          Y = (1/rw*i-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*(j+1)) * ls1
          Y = (1/rw*(i+1)-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*j) * ls1
          Y = (1/rw*(i+1)-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
          a = [...a, b]
        }
      }
      b = []
      for(let j=cl;j--;){
        X = S(p=Math.PI*2/cl*j) * ls1
        Y = ls2/2
        Z = C(p) * ls1
        b = [...b, [X,Y,Z]]
      }
      //a = [...a, b]
      return a
    }

    Tetrahedron = size => {
      ret = []
      a = []
      let h = size/1.4142/1.25
      for(i=3;i--;){
        X = S(p=Math.PI*2/3*i) * size/1.25
        Y = C(p) * size/1.25
        Z = h
        a = [...a, [X,Y,Z]]
      }
      ret = [...ret, a]
      for(j=3;j--;){
        a = []
        X = 0
        Y = 0
        Z = -h
        a = [...a, [X,Y,Z]]
        X = S(p=Math.PI*2/3*j) * size/1.25
        Y = C(p) * size/1.25
        Z = h
        a = [...a, [X,Y,Z]]
        X = S(p=Math.PI*2/3*(j+1)) * size/1.25
        Y = C(p) * size/1.25
        Z = h
        a = [...a, [X,Y,Z]]
        ret = [...ret, a]
      }
      ax=ay=az=ct=0
      ret.map(v=>{
        v.map(q=>{
          ax+=q[0]
          ay+=q[1]
          az+=q[2]
          ct++
        })
      })
      ax/=ct
      ay/=ct
      az/=ct
      ret.map(v=>{
        v.map(q=>{
          q[0]-=ax
          q[1]-=ay
          q[2]-=az
        })
      })
      return ret
    }

    Cube = size => {
      for(CB=[],j=6;j--;CB=[...CB,b])for(b=[],i=4;i--;)b=[...b,[(a=[S(p=Math.PI*2/4*i+Math.PI/4),C(p),2**.5/2])[j%3]*(l=j<3?size/1.5:-size/1.5),a[(j+1)%3]*l,a[(j+2)%3]*l]]
      return CB
    }
    
    Octahedron = size => {
      ret = []
      let h = size/1.25
      for(j=8;j--;){
        a = []
        X = 0
        Y = 0
        Z = h * (j<4?-1:1)
        a = [...a, [X,Y,Z]]
        X = S(p=Math.PI*2/4*j) * size/1.25
        Y = C(p) * size/1.25
        Z = 0
        a = [...a, [X,Y,Z]]
        X = S(p=Math.PI*2/4*(j+1)) * size/1.25
        Y = C(p) * size/1.25
        Z = 0
        a = [...a, [X,Y,Z]]
        ret = [...ret, a]
      }
      return ret      
    }
    
    Dodecahedron = size => {
      ret = []
      a = []
      mind = -6e6
      for(i=5;i--;){
        X=S(p=Math.PI*2/5*i + Math.PI/5)
        Y=C(p)
        Z=0
        if(Y>mind) mind=Y
        a = [...a, [X,Y,Z]]
      }
      a.map(v=>{
        X = v[0]
        Y = v[1]-=mind
        Z = v[2]
        R(0, .553573, 0)
        v[0] = X
        v[1] = Y
        v[2] = Z
      })
      b = JSON.parse(JSON.stringify(a))
      b.map(v=>{
        v[1] *= -1
      })
      ret = [...ret, a, b]
      mind = -6e6
      ret.map(v=>{
        v.map(q=>{
          X = q[0]
          Y = q[1]
          Z = q[2]
          if(Z>mind)mind = Z
        })
      })
      d1=Math.hypot(ret[0][0][0]-ret[0][1][0],ret[0][0][1]-ret[0][1][1],ret[0][0][2]-ret[0][1][2])
      ret.map(v=>{
        v.map(q=>{
          q[2]-=mind+d1/2
        })
      })
      b = JSON.parse(JSON.stringify(ret))
      b.map(v=>{
        v.map(q=>{
          q[2]*=-1
        })
      })
      ret = [...ret, ...b]
      b = JSON.parse(JSON.stringify(ret))
      b.map(v=>{
        v.map(q=>{
          X = q[0]
          Y = q[1]
          Z = q[2]
          R(0,0,Math.PI/2)
          R(0,Math.PI/2,0)
          q[0] = X
          q[1] = Y
          q[2] = Z
        })
      })
      e = JSON.parse(JSON.stringify(ret))
      e.map(v=>{
        v.map(q=>{
          X = q[0]
          Y = q[1]
          Z = q[2]
          R(0,0,Math.PI/2)
          R(Math.PI/2,0,0)
          q[0] = X
          q[1] = Y
          q[2] = Z
        })
      })
      ret = [...ret, ...b, ...e]
      ret.map(v=>{
        v.map(q=>{
          q[0] *= size/2
          q[1] *= size/2
          q[2] *= size/2
        })
      })
      return ret
    }
    
    Icosahedron = size => {
      ret = []
      B = [
        [[0,3],[1,0],[2,2]],
        [[0,3],[1,0],[1,3]],
        [[0,3],[2,3],[1,3]],
        [[0,2],[2,1],[1,0]],
        [[0,2],[1,3],[1,0]],
        [[0,2],[1,3],[2,0]],
        [[0,3],[2,2],[0,0]],
        [[1,0],[2,2],[2,1]],
        [[1,1],[2,2],[2,1]],
        [[1,1],[2,2],[0,0]],
        [[1,1],[2,1],[0,1]],
        [[0,2],[2,1],[0,1]],
        [[2,0],[1,2],[2,3]],
        [[0,0],[0,3],[2,3]],
        [[1,3],[2,0],[2,3]],
        [[2,3],[0,0],[1,2]],
        [[1,2],[2,0],[0,1]],
        [[0,0],[1,2],[1,1]],
        [[0,1],[1,2],[1,1]],
        [[0,2],[2,0],[0,1]],
      ]
      for(p=[1,1],i=38;i--;)p=[...p,p[l=p.length-1]+p[l-1]]
      phi = p[l]/p[l-1]
      a = [
        [-phi,-1,0],
        [phi,-1,0],
        [phi,1,0],
        [-phi,1,0],
      ]
      for(j=3;j--;ret=[...ret, b])for(b=[],i=4;i--;) b = [...b, [a[i][j],a[i][(j+1)%3],a[i][(j+2)%3]]]
      ret.map(v=>{
        v.map(q=>{
          q[0]*=size/2.25
          q[1]*=size/2.25
          q[2]*=size/2.25
        })
      })
      cp = JSON.parse(JSON.stringify(ret))
      out=[]
      a = []
      B.map(v=>{
        idx1a = v[0][0]
        idx2a = v[1][0]
        idx3a = v[2][0]
        idx1b = v[0][1]
        idx2b = v[1][1]
        idx3b = v[2][1]
        a = [...a, [cp[idx1a][idx1b],cp[idx2a][idx2b],cp[idx3a][idx3b]]]
      })
      out = [...out, ...a]
      return out
    }
    
    stroke = (scol, fcol, lwo=1, od=true) => {
      if(scol){
        x.closePath()
        if(od) x.globalAlpha = .2
        x.strokeStyle = scol
        x.lineWidth = Math.min(100,100*lwo/Z)
        if(od) x.stroke()
        x.lineWidth /= 4
        x.globalAlpha = 1
        x.stroke()
      }
      if(fcol){
        x.fillStyle = fcol
        x.fill()
      }
    }
    
    subbed = (subs, size, sphereize, shape) => {
      for(let m=subs; m--;){
        base = shape
        shape = []
        base.map(v=>{
          l = 0
          X1 = v[l][0]
          Y1 = v[l][1]
          Z1 = v[l][2]
          l = 1
          X2 = v[l][0]
          Y2 = v[l][1]
          Z2 = v[l][2]
          l = 2
          X3 = v[l][0]
          Y3 = v[l][1]
          Z3 = v[l][2]
          if(v.length > 3){
            l = 3
            X4 = v[l][0]
            Y4 = v[l][1]
            Z4 = v[l][2]
            if(v.length > 4){
              l = 4
              X5 = v[l][0]
              Y5 = v[l][1]
              Z5 = v[l][2]
            }
          }
          mx1 = (X1+X2)/2
          my1 = (Y1+Y2)/2
          mz1 = (Z1+Z2)/2
          mx2 = (X2+X3)/2
          my2 = (Y2+Y3)/2
          mz2 = (Z2+Z3)/2
          a = []
          switch(v.length){
            case 3:
              mx3 = (X3+X1)/2
              my3 = (Y3+Y1)/2
              mz3 = (Z3+Z1)/2
              X = X1, Y = Y1, Z = Z1, a = [...a, [X,Y,Z]]
              X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
              X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
              X = X2, Y = Y2, Z = Z2, a = [...a, [X,Y,Z]]
              X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
              X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
              X = X3, Y = Y3, Z = Z3, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
              X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
              X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              break
            case 4:
              mx3 = (X3+X4)/2
              my3 = (Y3+Y4)/2
              mz3 = (Z3+Z4)/2
              mx4 = (X4+X1)/2
              my4 = (Y4+Y1)/2
              mz4 = (Z4+Z1)/2
              cx = (X1+X2+X3+X4)/4
              cy = (Y1+Y2+Y3+Y4)/4
              cz = (Z1+Z2+Z3+Z4)/4
              X = X1, Y = Y1, Z = Z1, a = [...a, [X,Y,Z]]
              X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              X = mx4, Y = my4, Z = mz4, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
              X = X2, Y = Y2, Z = Z2, a = [...a, [X,Y,Z]]
              X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
              X = X3, Y = Y3, Z = Z3, a = [...a, [X,Y,Z]]
              X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = mx4, Y = my4, Z = mz4, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
              X = X4, Y = Y4, Z = Z4, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              break
            case 5:
              cx = (X1+X2+X3+X4+X5)/5
              cy = (Y1+Y2+Y3+Y4+Y5)/5
              cz = (Z1+Z2+Z3+Z4+Z5)/5
              mx3 = (X3+X4)/2
              my3 = (Y3+Y4)/2
              mz3 = (Z3+Z4)/2
              mx4 = (X4+X5)/2
              my4 = (Y4+Y5)/2
              mz4 = (Z4+Z5)/2
              mx5 = (X5+X1)/2
              my5 = (Y5+Y1)/2
              mz5 = (Z5+Z1)/2
              X = X1, Y = Y1, Z = Z1, a = [...a, [X,Y,Z]]
              X = X2, Y = Y2, Z = Z2, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = X2, Y = Y2, Z = Z2, a = [...a, [X,Y,Z]]
              X = X3, Y = Y3, Z = Z3, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = X3, Y = Y3, Z = Z3, a = [...a, [X,Y,Z]]
              X = X4, Y = Y4, Z = Z4, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = X4, Y = Y4, Z = Z4, a = [...a, [X,Y,Z]]
              X = X5, Y = Y5, Z = Z5, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = X5, Y = Y5, Z = Z5, a = [...a, [X,Y,Z]]
              X = X1, Y = Y1, Z = Z1, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              break
          }
        })
      }
      if(sphereize){
        ip1 = sphereize
        ip2 = 1-sphereize
        shape = shape.map(v=>{
          v = v.map(q=>{
            X = q[0]
            Y = q[1]
            Z = q[2]
            d = Math.hypot(X,Y,Z)
            X /= d
            Y /= d
            Z /= d
            X *= size*.75*ip1 + d*ip2
            Y *= size*.75*ip1 + d*ip2
            Z *= size*.75*ip1 + d*ip2
            return [X,Y,Z]
          })
          return v
        })
      }
      return shape
    }
    
    subDividedIcosahedron  = (subs, size, sphereize = 0) => subbed(subs, size, sphereize, Icosahedron(size))
    subDividedTetrahedron  = (subs, size, sphereize = 0) => subbed(subs, size, sphereize, Tetrahedron(size))
    subDividedOctahedron   = (subs, size, sphereize = 0) => subbed(subs, size, sphereize, Octahedron(size))
    subDividedCube         = (subs, size, sphereize = 0) => subbed(subs, size, sphereize, Cube(size))
    subDividedDodecahedron = (subs, size, sphereize = 0) => subbed(subs, size, sphereize, Dodecahedron(size))
    
    Rn = Math.random
    
    LsystemRecurse = (size, splits, p1, p2, stem, theta, LsystemReduction, twistFactor) => {
      if(size < .5) return
      let X1 = stem[0]
      let Y1 = stem[1]
      let Z1 = stem[2]
      let X2 = stem[3]
      let Y2 = stem[4]
      let Z2 = stem[5]
      let p1a = Math.atan2(X2-X1,Z2-Z1)
      let p2a = -Math.acos((Y2-Y1)/(Math.hypot(X2-X1,Y2-Y1,Z2-Z1)+.0001))+Math.PI
      size/=LsystemReduction
      for(let i=splits;i--;){
        X = 0
        Y = -size
        Z = 0
        R(0, theta, 0)
        R(0, 0, Math.PI*2/splits*i+twistFactor)
        R(0, p2a, 0)
        R(0, 0, p1a+twistFactor)
        X+=X2
        Y+=Y2
        Z+=Z2
        let newStem = [X2, Y2, Z2, X, Y, Z]
        Lshp = [...Lshp, newStem]
        LsystemRecurse(size, splits, p1+Math.PI*2/splits*i+twistFactor, p2+theta, newStem, theta, LsystemReduction, twistFactor)
      }
    }
    DrawLsystem = shp => {
      shp.map(v=>{
        x.beginPath()
        X = v[0]
        Y = v[1]
        Z = v[2]
        R(Rl,Pt,Yw,1)
        if(Z>0)x.lineTo(...Q())
        X = v[3]
        Y = v[4]
        Z = v[5]
        R(Rl,Pt,Yw,1)
        if(Z>0)x.lineTo(...Q())
        lwo = Math.hypot(v[0]-v[3],v[1]-v[4],v[2]-v[5])
        stroke('#0f82','',lwo)
      })
      
    }
    Lsystem = (size, splits, theta, LsystemReduction, twistFactor) => {
      Lshp = []
      stem = [0,0,0,0,-size,0]
      Lshp = [...Lshp, stem]
      LsystemRecurse(size, splits, 0, 0, stem, theta, LsystemReduction, twistFactor)
      Lshp.map(v=>{
        v[1]+=size*1.5
        v[4]+=size*1.5
      })
      return Lshp
    }
    
    Sphere = (ls, rw, cl) => {
      a = []
      ls/=1.25
      for(j = rw; j--;){
        for(i = cl; i--;){
          b = []
          X = S(p = Math.PI*2/cl*i) * S(q = Math.PI/rw*j) * ls
          Y = C(q) * ls
          Z = C(p) * S(q) * ls
          b = [...b, [X,Y,Z]]
          X = S(p = Math.PI*2/cl*(i+1)) * S(q = Math.PI/rw*j) * ls
          Y = C(q) * ls
          Z = C(p) * S(q) * ls
          b = [...b, [X,Y,Z]]
          X = S(p = Math.PI*2/cl*(i+1)) * S(q = Math.PI/rw*(j+1)) * ls
          Y = C(q) * ls
          Z = C(p) * S(q) * ls
          b = [...b, [X,Y,Z]]
          X = S(p = Math.PI*2/cl*i) * S(q = Math.PI/rw*(j+1)) * ls
          Y = C(q) * ls
          Z = C(p) * S(q) * ls
          b = [...b, [X,Y,Z]]
          a = [...a, b]
        }
      }
      return a
    }
    
    Torus = (rw,cl,ls1,ls2) => {
      let ret = []
      for(j=rw;j--;)for(let i = cl;i--;){
        a = []
        X = S(p=Math.PI*2/cl*i) * ls1 + ls2
        Y = C(p) * ls1 + ls2
        Z = 0
        R(0, 0, Math.PI*2/rw*j)
        a = [...a, [X,Y,Z]]
        X = S(p=Math.PI*2/cl*(i+1)) * ls1 + ls2
        Y = C(p) * ls1 + ls2
        Z = 0
        R(0, 0, Math.PI*2/rw*j)
        a = [...a, [X,Y,Z]]
        X = S(p=Math.PI*2/cl*(i+1)) * ls1 + ls2
        Y = C(p) * ls1 + ls2
        Z = 0
        R(0, 0, Math.PI*2/rw*(j+1))
        a = [...a, [X,Y,Z]]
        X = S(p=Math.PI*2/cl*i) * ls1 + ls2
        Y = C(p) * ls1 + ls2
        Z = 0
        R(0, 0, Math.PI*2/rw*(j+1))
        a = [...a, [X,Y,Z]]
        ret = [...ret, a]
      }
      return ret
    }
   
    G=10
    bounding = subDividedDodecahedron(0,G,1).map(v=>{
      v.map(q=>{
        X = q[0]
        Y = q[1]
        Z = q[2]
        R(0,0,0)
        q[0] = X
        q[1] = Y
        q[2] = Z
      })
      return v
    })
    

    miniCluster = []
    b=[]
    for(m=2;m--;){
      ls = 1.25
      mag = m?ls:ls/2
      for(j=7;j--;){
        tx = j?S(p=Math.PI*2/6*j)*ls*1.7320508075688772:0
        ty = j?C(p)*ls*1.7320508075688772:0
        a = []
        for(i=6;i--;){
          X = S(p=Math.PI*2/6*i+Math.PI/6)*mag + tx
          Y = C(p)*mag + ty
          Z = 0
          a = [...a, [X,Y,Z]]
        }
        b = [...b, a]
      }
    }
    miniCluster = b
    
    clusters = []
    ls=G/1.5
    bounding.map(v=>{
      ax=ay=az=0
      v.map(q=>{
        ax+=q[0]
        ay+=q[1]
        az+=q[2]
      })
      ax/=v.length
      ay/=v.length
      az/=v.length
      
      p1 = Math.atan2(ax,az)
      p2 = Math.acos(ay/Math.hypot(ax,ay,az))
      nx=ny=nz=ct=0
      mini = JSON.parse(JSON.stringify(miniCluster)).map(q=>{
        q.map(n=>{
          X = n[0]
          Y = n[1]
          Z = n[2]
          R(0,-p2+Math.PI/2,0)
          R(0,0,p1)
          X+=ax
          Y+=ay
          Z+=az
          d = Math.hypot(X,Y,Z)
          X/=d
          Y/=d
          Z/=d
          X*=ls
          Y*=ls
          Z*=ls
          nx+=n[0]=X
          ny+=n[1]=Y
          nz+=n[2]=Z
          ct++
          return n
        })
        return q
      })
      X = nx/ct
      Y = ny/ct
      Z = nz/ct
      clusters = [...clusters, [X,Y,Z,mini,0]]
    })
    
    
    drawBezier=(X1,Y1,X2,Y2,col,alpha)=>{
      dflj = x.lineJoin
      x.lineJoin = x.lineCap = 'round'
      x.beginPath()
      x.moveTo(X1,Y1)
      x.bezierCurveTo(X1+(X2-X1)/2,Y1,X1+(X2-X1)/2,Y2,X2,Y2)
      x.strokeStyle = col
      x.lineWidth=Math.min(500,150/Z*(1+alpha*8))
      x.stroke()
      x.lineWidth/=4
      x.strokeStyle = '#fff4'
      x.stroke()
      x.lineJoin = x.lineCap = dflj
    }
    
    sharps = ['A#/B♭','','C#/D♭','D#/E♭','','F#/G♭','G#/A♭']
    notes = 'ABCDEFG'
    
    audioCtx = new(window.AudioContext || window.webkitAudioContext)()

    beep = (volume, frequency, duration, type) =>{
      switch (type) {
        case 0: type = 'sine'; break;
        case 1: type = 'square'; break;
        case 2: type = 'sawtooth'; break;
        case 3: type = 'triangle'; break;
      }
      let osc = audioCtx.createOscillator()
      let gainNode = audioCtx.createGain()
      osc.connect(gainNode)
      gainNode.connect(audioCtx.destination)
      gainNode.gain.value = volume
      osc.frequency.value = frequency
      osc.type = type
      osc.start()
      setTimeout(()=>{
          osc.stop()
        },
        duration
      )
    }
    playMetronome = false

    notemap = [["A",0,27.5],["A#",0,29.135235],["Bb",0,29.135235],["B",0,30.867706],["C",0,32.703196],["C#",0,34.647829],["Db",0,34.647829],["D",0,36.708096],["D#",0,38.890873],["Eb",0,38.890873],["E",0,41.203445],["F",0,43.653529],["F#",0,46.249303],["Gb",0,46.249303],["G",0,48.999429],["G#",0,51.913087],["Ab",0,51.913087],["A",1,55],["A#",1,58.27047],["Bb",1,58.27047],["B",1,61.735413],["C",1,65.406391],["C#",1,69.295658],["Db",1,69.295658],["D",1,73.416192],["D#",1,77.781746],["Eb",1,77.781746],["E",1,82.406889],["F",1,87.307058],["F#",1,92.498606],["Gb",1,92.498606],["G",1,97.998859],["G#",1,103.826174],["Ab",1,103.826174],["A",2,110],["A#",2,116.54094],["Bb",2,116.54094],["B",2,123.470825],["C",2,130.812783],["C#",2,138.591315],["Db",2,138.591315],["D",2,146.832384],["D#",2,155.563492],["Eb",2,155.563492],["E",2,164.813778],["F",2,174.614116],["F#",2,184.997211],["Gb",2,184.997211],["G",2,195.997718],["G#",2,207.652349],["Ab",2,207.652349],["A",3,220],["A#",3,233.081881],["Bb",3,233.081881],["B",3,246.941651],["C",3,261.625565],["C#",3,277.182631],["Db",3,277.182631],["D",3,293.664768],["D#",3,311.126984],["Eb",3,311.126984],["E",3,329.627557],["F",3,349.228231],["F#",3,369.994423],["Gb",3,369.994423],["G",3,391.995436],["G#",3,415.304698],["Ab",3,415.304698],["A",4,440],["A#",4,466.163762],["Bb",4,466.163762],["B",4,493.883301],["C",4,523.251131],["C#",4,554.365262],["Db",4,554.365262],["D",4,587.329536],["D#",4,622.253967],["Eb",4,622.253967],["E",4,659.255114],["F",4,698.456463],["F#",4,739.988845],["Gb",4,739.988845],["G",4,783.990872],["G#",4,830.609395],["Ab",4,830.609395],["A",5,880],["A#",5,932.327523],["Bb",5,932.327523],["B",5,987.766603],["C",5,1046.502261],["C#",5,1108.730524],["Db",5,1108.730524],["D",5,1174.659072],["D#",5,1244.507935],["Eb",5,1244.507935],["E",5,1318.510228],["F",5,1396.912926],["F#",5,1479.977691],["Gb",5,1479.977691],["G",5,1567.981744],["G#",5,1661.21879],["Ab",5,1661.21879],["A",6,1760],["A#",6,1864.655046],["Bb",6,1864.655046],["B",6,1975.533205],["C",6,2093.004522],["C#",6,2217.461048],["Db",6,2217.461048],["D",6,2349.318143],["D#",6,2489.01587],["Eb",6,2489.01587],["E",6,2637.020455],["F",6,2793.825851],["F#",6,2959.955382],["Gb",6,2959.955382],["G",6,3135.963488],["G#",6,3322.437581],["Ab",6,3322.437581],["A",7,3520],["A#",7,3729.310092],["Bb",7,3729.310092],["B",7,3951.06641],["C",7,4186.009045],["C#",7,4434.922096],["Db",7,4434.922096],["D",7,4698.636287],["D#",7,4978.03174],["Eb",7,4978.03174],["E",7,5274.040911],["F",7,5587.651703],["F#",7,5919.910763],["Gb",7,5919.910763],["G",7,6271.926976],["G#",7,6644.875161],["Ab",7,6644.875161],["A",8,7040],["A#",8,7458.620184],["Bb",8,7458.620184],["B",8,7902.13282],["C",8,8372.01809]]

    
    highlights = JSON.parse(JSON.stringify(notemap)).map(v=>{
      v[3]=0
      return v
    })
    
    getFreq=(note, octave)=>{
       let el = notemap.filter(v=>v[0]==note && v[1]==octave)
       if(el.length) return el[0][2]
    }
    
    tempo = 300
    song = [
      
      ['A', 1, 1, 500, 2],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['C', 5, .5, 100, 3],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['A', 5, .5, 100, 3],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['C', 5, .5, 100, 3],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['G', 3, .5, 100, 3],
      [''],
      
      ['A', 1, 1, 500, 2],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['C', 5, .5, 100, 3],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['A', 5, .5, 100, 3],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['C', 5, .5, 100, 3],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['G', 3, .5, 100, 3],
      [''],
      
      ['A', 1, 1, 500, 2],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['C', 5, .5, 100, 3],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['A', 5, .5, 100, 3],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['C', 5, .5, 100, 3],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['G', 3, .5, 100, 3],
      [''],
      
      ['A', 1, 1, 500, 2],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['C', 5, .5, 100, 3],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['A', 5, .5, 100, 3],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['C', 5, .5, 100, 3],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['G', 3, .5, 100, 3],
      [''],
      
      
      ['Ab', 2, 1, 500, 2],
      [''],
      ['Eb', 5, .5, 100, 3],
      [''],
      ['C', 5, .5, 100, 3],
      [''],
      ['Eb', 5, .5, 100, 3],
      [''],
      ['Ab', 5, .5, 100, 3],
      [''],
      ['Eb', 5, .5, 100, 3],
      [''],
      ['C', 5, .5, 100, 3],
      [''],
      ['Eb', 5, .5, 100, 3],
      [''],
      ['Ab', 3, .5, 100, 3],
      [''],
      
      ['Ab', 1, 1, 500, 2],
      [''],
      ['Eb', 5, .5, 100, 3],
      [''],
      ['C', 5, .5, 100, 3],
      [''],
      ['Eb', 5, .5, 100, 3],
      [''],
      ['Ab', 5, .5, 100, 3],
      [''],
      ['Eb', 5, .5, 100, 3],
      [''],
      ['C', 5, .5, 100, 3],
      [''],
      ['Eb', 5, .5, 100, 3],
      [''],
      ['Ab', 3, .5, 100, 3],
      [''],

      
      ['Eb', 1, 1, 500, 2],
      [''],
      ['Bb', 5, .5, 100, 3],
      [''],
      ['G', 5, .5, 100, 3],
      [''],
      ['Bb', 5, .5, 100, 3],
      [''],
      ['Eb', 5, .5, 100, 3],
      [''],
      ['Bb', 5, .5, 100, 3],
      [''],
      ['G', 5, .5, 100, 3],
      [''],
      ['Eb', 5, .5, 100, 3],
      [''],
      ['G', 6, .5, 100, 3],
      [''],
      
      
      ['Eb', 1, 1, 500, 2],
      [''],
      ['Bb', 5, .5, 100, 3],
      [''],
      ['G', 5, .5, 100, 3],
      [''],
      ['Bb', 5, .5, 100, 3],
      [''],
      ['Eb', 5, .5, 100, 3],
      [''],
      ['Bb', 5, .5, 100, 3],
      [''],
      ['G', 5, .5, 100, 3],
      [''],
      ['Eb', 5, .5, 100, 3],
      [''],
      ['G', 6, .5, 100, 3],
      [''],
      

          
      ['G', 2, 1, 500, 2],
      [''],
      ['A', 5, .5, 100, 3],
      [''],
      ['A#', 5, .5, 100, 3],
      [''],
      ['D', 5, .5, 100, 3],
      [''],
      ['G', 5, .5, 100, 3],
      [''],
      ['A', 5, .5, 100, 3],
      [''],
      ['A#', 5, .5, 100, 3],
      [''],
      ['D', 5, .5, 100, 3],
      [''],
      ['G', 6, .5, 100, 3],
      [''],
      
          
      ['D', 2, 1, 500, 2],
      [''],
      ['F', 5, .5, 100, 3],
      [''],
      ['A', 5, .5, 100, 3],
      [''],
      ['D', 5, .5, 100, 3],
      [''],
      ['D', 5, .5, 100, 3],
      [''],
      ['F', 5, .5, 100, 3],
      [''],
      ['A', 5, .5, 100, 3],
      [''],
      ['D', 5, .5, 100, 3],
      [''],
      ['D', 6, .5, 100, 3],
      [''],
      
          
      ['A', 1, 1, 500, 2],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['C', 5, .5, 100, 3],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['A', 5, .5, 100, 3],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['C', 5, .5, 100, 3],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['G', 3, .5, 100, 3],
      [''],
      
      ['A', 1, 1, 500, 2],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['C', 5, .5, 100, 3],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['A', 5, .5, 100, 3],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['C', 5, .5, 100, 3],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['G', 3, .5, 100, 3],
      [''],
      
      ['E', 3, 1, 500, 2],
      [''],
      ['B', 5, .5, 100, 3],
      [''],
      ['A', 5, .5, 100, 3],
      [''],
      ['B', 5, .5, 100, 3],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['B', 5, .5, 100, 3],
      [''],
      ['A', 5, .5, 100, 3],
      [''],
      ['B', 5, .5, 100, 3],
      [''],
      ['A', 3, .5, 100, 3],
      [''],
      
      ['E', 1, 1, 500, 2],
      [''],
      ['B', 5, .5, 100, 3],
      [''],
      ['Ab', 5, .5, 100, 3],
      [''],
      ['B', 5, .5, 100, 3],
      [''],
      ['E', 5, .5, 100, 3],
      [''],
      ['B', 5, .5, 100, 3],
      [''],
      ['Ab', 5, .5, 100, 3],
      [''],
      ['B', 5, .5, 100, 3],
      [''],
      ['Ab', 3, .5, 100, 3],
      [''],
      
]
    
    
    playing = false
    window.onclick = () =>{
      playing = !playing
      if(playing){
        songpos = 0, processAudio()
      }
    }

    playing = false;
    window.onclick = window.ontouchstart = () => {
        playing = !playing;
        if (playing) {
          songpos = 0, processAudio()
  }
}
    processAudio=()=>{
      song.map((v,i)=>{
        if(i==songpos){
          highlights.map(q=>{
            if(q[0]==v[0]&&q[1]==v[1]){
              q[3] = 1+v[2]/100
            }
          })          
          if(v[0]){
            freq = getFreq(v[0], v[1])
            if(freq){
              vol = v[2]
              dur = v[3]
              type = v[4]
              beep(vol,freq,dur,type)
            }
          }
        }
      })
      songpos = (songpos+1)%song.length
      if(playing) setTimeout(()=>{processAudio()}, 1000/tempo*60/8)
    }
    
    bg = new Image()
    bg.src = 'https://github.com/srmcgann/render/blob/main/clouds.jpg?raw=true'
  }

  oX=0, oY=0, oZ=12
  Rl=S(t/2)/4, Pt=C(t/4)/4, Yw=S(t/4)*4

  highlights.map(q=>{
    q[3]/=1.125
  })
  
  x.globalAlpha = .3
  x.drawImage(bg,0,0,c.width,c.height)
  x.globalAlpha = 1
  x.fillStyle='#0008'
  x.fillRect(0,0,c.width,c.height)
  x.lineJoin = x.lineCap = 'round'
  
  if(1)bounding.map(v=>{
    x.beginPath()
    v.map(q=>{
      
      X = q[0]*.95
      Y = q[1]*.95
      Z = q[2]*.95
      R(Rl,Pt,Yw,1)
      if(Z>0)x.lineTo(...Q())
    })
    stroke('#fff1','',3)
  })
  x.lineJoin = x.lineCap = 'butt'
  
  clusters.map((cluster, idx)=>{
    cluster[4]/=1.1
    cluster[3].map((v,i)=>{
      ax=ay=az=0
      v.map(q=>{
        ax+=q[0]
        ay+=q[1]
        az+=q[2]
      })
      ax/=v.length
      ay/=v.length
      az/=v.length
      x.fillStyle = '#fff8'

      X = ax//-(i>6?.3:0)
      Y = ay-(i>6?.5:0)
      Z = az
      R(Rl,Pt,Yw,1)
      x.font=(d=200/Z)+'px courier'
      l = Q()
      thisnote = ''+(i>6?sharps[i%7]:notes[i%7])
      brgel = highlights.filter(q=>q[0]==thisnote && q[1]==idx)
      brg = brgel.length ? brgel[0][3] : 0
      cluster[4] = Math.max(cluster[4], brg)
      //x.globalAlpha = Math.max(0,Math.min(.75,(.3+S(t*2))))
      x.fillText(thisnote,l[0]+d/3+(i>6?d:0),l[1]+d/3)
      x.globalAlpha = 1

     x.beginPath()
      v.map(q=>{
        X = q[0]
        Y = q[1]
        Z = q[2]
        R(Rl,Pt,Yw,1)
        if(Z>0)x.lineTo(...Q())
      })
      stroke('#fff1',`hsla(${360/clusters.length*idx+180},99%,${50+brg*50}%,${Math.max(brg,.05)})`)
    })
  })
  
  
  //x.globalAlpha = Math.max(.1,Math.min(.65,(.3-C(t))))
  for(i=0;i<12;i++){
    x.textAlign='right'
    x.fillStyle = '#fff'
    x.font = '32px courier'
    x.fillText('octave '+i,X1=200,Y1=i*80+100)
    
    clusters.map((cluster, idx)=>{
      if(idx==i){
        X = cluster[0]*1.05
        Y = cluster[1]*1.05
        Z = cluster[2]*1.05
        R(Rl,Pt,Yw,1)
        if(Z>0){
          drawBezier(X1+40,Y1-10,...Q(),`hsla(${360/clusters.length*idx+180},99%,50%,${.05+cluster[4]/2})`,cluster[4])
        }
      }
    })
  }
  x.globalAlpha = 1
    
  t+=1/60
  requestAnimationFrame(Draw)
}
Draw()


/*
for(wb=[0,1,0,0,1,0,1,0,0,1,0,1],b=['A','A#/B♭','B','C','C#/D♭','D','D#/E♭','E','F','F#/G♭','G','G#/A♭'],a='',f=55,i=0;i<96;i++)a+=`${wb[i%12]}">${b[i%12]}
octave: ${(1+i/12|0)}
Hz: ${(f*1e5|0)/1e5}\n`,f+=f*(2**(1/12)-1)
console.log(a)
*/