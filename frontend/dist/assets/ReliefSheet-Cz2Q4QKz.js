import{r as Ee,y as Jx,j as Bt,h as Of,p as Lg,q as Kx}from"./index-B8L1bPe6.js";import{f as jx,V as cr,g as Qx,h as Ov,i as $x,j as eS,k as tS,t as nS}from"./App-BZS8MX0N.js";import"./locate-Bl4wZ1eM.js";import"./MarineMap-Cgjvls5p.js";/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const qa="169",iS={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},rS={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Fv=0,Vd=1,Bv=2,sS=3,zv=0,Ju=1,va=2,wi=3,fr=0,Bn=1,zi=2,hr=0,_s=1,Gd=2,Wd=3,Xd=4,kv=5,Or=100,Hv=101,Vv=102,Gv=103,Wv=104,Xv=200,Yv=201,qv=202,Zv=203,ou=204,au=205,Jv=206,Kv=207,jv=208,Qv=209,$v=210,e_=211,t_=212,n_=213,i_=214,lu=0,cu=1,uu=2,Es=3,hu=4,fu=5,du=6,pu=7,Za=0,r_=1,s_=2,Gi=0,o_=1,a_=2,l_=3,op=4,c_=5,u_=6,h_=7,Yd="attached",f_="detached",Ku=300,dr=301,Fr=302,ba=303,Ca=304,Ro=306,Ra=1e3,mi=1001,Pa=1002,dn=1003,ap=1004,oS=1004,vo=1005,aS=1005,nn=1006,_a=1007,lS=1007,Hi=1008,cS=1008,Ai=1009,lp=1010,cp=1011,Eo=1012,ju=1013,pr=1014,Yn=1015,Po=1016,Qu=1017,$u=1018,As=1020,up=35902,hp=1021,fp=1022,Rn=1023,dp=1024,pp=1025,ys=1026,Ts=1027,eh=1028,Ja=1029,mp=1030,th=1031,uS=1032,nh=1033,ya=33776,xa=33777,Sa=33778,Ma=33779,mu=35840,gu=35841,vu=35842,_u=35843,yu=36196,xu=37492,Su=37496,Mu=37808,wu=37809,Eu=37810,Au=37811,Tu=37812,bu=37813,Cu=37814,Ru=37815,Pu=37816,Iu=37817,Lu=37818,Du=37819,Uu=37820,Nu=37821,wa=36492,Ou=36494,Fu=36495,gp=36283,Bu=36284,zu=36285,ku=36286,d_=2200,p_=2201,m_=2202,Ia=2300,Hu=2301,nu=2302,ps=2400,ms=2401,La=2402,ih=2500,vp=2501,hS=0,fS=1,dS=2,g_=3200,v_=3201,pS=3202,mS=3203,zr=0,__=1,ar="",Wn="srgb",gr="srgb-linear",rh="display-p3",Ka="display-p3-linear",Da="linear",zt="srgb",Ua="rec709",Na="p3",gS=0,us=7680,vS=7681,_S=7682,yS=7683,xS=34055,SS=34056,MS=5386,wS=512,ES=513,AS=514,TS=515,bS=516,CS=517,RS=518,qd=519,y_=512,x_=513,S_=514,_p=515,M_=516,w_=517,E_=518,A_=519,Oa=35044,PS=35048,IS=35040,LS=35045,DS=35049,US=35041,NS=35046,OS=35050,FS=35042,BS="100",Zd="300 es",Vi=2e3,Fa=2001;class Yi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let s=0,l=i.length;s<l;s++)i[s].call(this,e);e.target=null}}}const Tn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Dg=1234567;const xs=Math.PI/180,Ao=180/Math.PI;function ii(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Tn[r&255]+Tn[r>>8&255]+Tn[r>>16&255]+Tn[r>>24&255]+"-"+Tn[e&255]+Tn[e>>8&255]+"-"+Tn[e>>16&15|64]+Tn[e>>24&255]+"-"+Tn[t&63|128]+Tn[t>>8&255]+"-"+Tn[t>>16&255]+Tn[t>>24&255]+Tn[n&255]+Tn[n>>8&255]+Tn[n>>16&255]+Tn[n>>24&255]).toLowerCase()}function Zt(r,e,t){return Math.max(e,Math.min(t,r))}function yp(r,e){return(r%e+e)%e}function zS(r,e,t,n,i){return n+(r-e)*(i-n)/(t-e)}function kS(r,e,t){return r!==e?(t-r)/(e-r):0}function Ea(r,e,t){return(1-t)*r+t*e}function HS(r,e,t,n){return Ea(r,e,1-Math.exp(-t*n))}function VS(r,e=1){return e-Math.abs(yp(r,e*2)-e)}function GS(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function WS(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function XS(r,e){return r+Math.floor(Math.random()*(e-r+1))}function YS(r,e){return r+Math.random()*(e-r)}function qS(r){return r*(.5-Math.random())}function ZS(r){r!==void 0&&(Dg=r);let e=Dg+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function JS(r){return r*xs}function KS(r){return r*Ao}function jS(r){return(r&r-1)===0&&r!==0}function QS(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function $S(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function eM(r,e,t,n,i){const s=Math.cos,l=Math.sin,c=s(t/2),u=l(t/2),h=s((e+n)/2),d=l((e+n)/2),p=s((e-n)/2),m=l((e-n)/2),g=s((n-e)/2),y=l((n-e)/2);switch(i){case"XYX":r.set(c*d,u*p,u*m,c*h);break;case"YZY":r.set(u*m,c*d,u*p,c*h);break;case"ZXZ":r.set(u*p,u*m,c*d,c*h);break;case"XZX":r.set(c*d,u*y,u*g,c*h);break;case"YXY":r.set(u*g,c*d,u*y,c*h);break;case"ZYZ":r.set(u*y,u*g,c*d,c*h);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Fn(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function dt(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}const T_={DEG2RAD:xs,RAD2DEG:Ao,generateUUID:ii,clamp:Zt,euclideanModulo:yp,mapLinear:zS,inverseLerp:kS,lerp:Ea,damp:HS,pingpong:VS,smoothstep:GS,smootherstep:WS,randInt:XS,randFloat:YS,randFloatSpread:qS,seededRandom:ZS,degToRad:JS,radToDeg:KS,isPowerOfTwo:jS,ceilPowerOfTwo:QS,floorPowerOfTwo:$S,setQuaternionFromProperEuler:eM,normalize:dt,denormalize:Fn};class fe{constructor(e=0,t=0){fe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Zt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,l=this.y-e.y;return this.x=s*n-l*i+e.x,this.y=s*i+l*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ft{constructor(e,t,n,i,s,l,c,u,h){ft.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,l,c,u,h)}set(e,t,n,i,s,l,c,u,h){const d=this.elements;return d[0]=e,d[1]=i,d[2]=c,d[3]=t,d[4]=s,d[5]=u,d[6]=n,d[7]=l,d[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,l=n[0],c=n[3],u=n[6],h=n[1],d=n[4],p=n[7],m=n[2],g=n[5],y=n[8],M=i[0],x=i[3],_=i[6],E=i[1],w=i[4],T=i[7],O=i[2],P=i[5],L=i[8];return s[0]=l*M+c*E+u*O,s[3]=l*x+c*w+u*P,s[6]=l*_+c*T+u*L,s[1]=h*M+d*E+p*O,s[4]=h*x+d*w+p*P,s[7]=h*_+d*T+p*L,s[2]=m*M+g*E+y*O,s[5]=m*x+g*w+y*P,s[8]=m*_+g*T+y*L,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],l=e[4],c=e[5],u=e[6],h=e[7],d=e[8];return t*l*d-t*c*h-n*s*d+n*c*u+i*s*h-i*l*u}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],l=e[4],c=e[5],u=e[6],h=e[7],d=e[8],p=d*l-c*h,m=c*u-d*s,g=h*s-l*u,y=t*p+n*m+i*g;if(y===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/y;return e[0]=p*M,e[1]=(i*h-d*n)*M,e[2]=(c*n-i*l)*M,e[3]=m*M,e[4]=(d*t-i*u)*M,e[5]=(i*s-c*t)*M,e[6]=g*M,e[7]=(n*u-h*t)*M,e[8]=(l*t-n*s)*M,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,l,c){const u=Math.cos(s),h=Math.sin(s);return this.set(n*u,n*h,-n*(u*l+h*c)+l+e,-i*h,i*u,-i*(-h*l+u*c)+c+t,0,0,1),this}scale(e,t){return this.premultiply(Ff.makeScale(e,t)),this}rotate(e){return this.premultiply(Ff.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ff.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ff=new ft;function b_(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}const tM={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array};function _o(r,e){return new tM[r](e)}function Ba(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function C_(){const r=Ba("canvas");return r.style.display="block",r}const Ug={};function iu(r){r in Ug||(Ug[r]=!0,console.warn(r))}function nM(r,e,t){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}function iM(r){const e=r.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function rM(r){const e=r.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Ng=new ft().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Og=new ft().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),$o={[gr]:{transfer:Da,primaries:Ua,luminanceCoefficients:[.2126,.7152,.0722],toReference:r=>r,fromReference:r=>r},[Wn]:{transfer:zt,primaries:Ua,luminanceCoefficients:[.2126,.7152,.0722],toReference:r=>r.convertSRGBToLinear(),fromReference:r=>r.convertLinearToSRGB()},[Ka]:{transfer:Da,primaries:Na,luminanceCoefficients:[.2289,.6917,.0793],toReference:r=>r.applyMatrix3(Og),fromReference:r=>r.applyMatrix3(Ng)},[rh]:{transfer:zt,primaries:Na,luminanceCoefficients:[.2289,.6917,.0793],toReference:r=>r.convertSRGBToLinear().applyMatrix3(Og),fromReference:r=>r.applyMatrix3(Ng).convertLinearToSRGB()}},sM=new Set([gr,Ka]),Lt={enabled:!0,_workingColorSpace:gr,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(r){if(!sM.has(r))throw new Error(`Unsupported working color space, "${r}".`);this._workingColorSpace=r},convert:function(r,e,t){if(this.enabled===!1||e===t||!e||!t)return r;const n=$o[e].toReference,i=$o[t].fromReference;return i(n(r))},fromWorkingColorSpace:function(r,e){return this.convert(r,this._workingColorSpace,e)},toWorkingColorSpace:function(r,e){return this.convert(r,e,this._workingColorSpace)},getPrimaries:function(r){return $o[r].primaries},getTransfer:function(r){return r===ar?Da:$o[r].transfer},getLuminanceCoefficients:function(r,e=this._workingColorSpace){return r.fromArray($o[e].luminanceCoefficients)}};function wo(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Bf(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let Zs;class R_{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Zs===void 0&&(Zs=Ba("canvas")),Zs.width=e.width,Zs.height=e.height;const n=Zs.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Zs}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ba("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let l=0;l<s.length;l++)s[l]=wo(s[l]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(wo(t[n]/255)*255):t[n]=wo(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let oM=0;class gs{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:oM++}),this.uuid=ii(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let l=0,c=i.length;l<c;l++)i[l].isDataTexture?s.push(zf(i[l].image)):s.push(zf(i[l]))}else s=zf(i);n.url=s}return t||(e.images[this.uuid]=n),n}}function zf(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?R_.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let aM=0;class Jt extends Yi{constructor(e=Jt.DEFAULT_IMAGE,t=Jt.DEFAULT_MAPPING,n=mi,i=mi,s=nn,l=Hi,c=Rn,u=Ai,h=Jt.DEFAULT_ANISOTROPY,d=ar){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:aM++}),this.uuid=ii(),this.name="",this.source=new gs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=l,this.anisotropy=h,this.format=c,this.internalFormat=null,this.type=u,this.offset=new fe(0,0),this.repeat=new fe(1,1),this.center=new fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ft,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ku)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ra:e.x=e.x-Math.floor(e.x);break;case mi:e.x=e.x<0?0:1;break;case Pa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ra:e.y=e.y-Math.floor(e.y);break;case mi:e.y=e.y<0?0:1;break;case Pa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Jt.DEFAULT_IMAGE=null;Jt.DEFAULT_MAPPING=Ku;Jt.DEFAULT_ANISOTROPY=1;class yt{constructor(e=0,t=0,n=0,i=1){yt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=this.w,l=e.elements;return this.x=l[0]*t+l[4]*n+l[8]*i+l[12]*s,this.y=l[1]*t+l[5]*n+l[9]*i+l[13]*s,this.z=l[2]*t+l[6]*n+l[10]*i+l[14]*s,this.w=l[3]*t+l[7]*n+l[11]*i+l[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s;const u=e.elements,h=u[0],d=u[4],p=u[8],m=u[1],g=u[5],y=u[9],M=u[2],x=u[6],_=u[10];if(Math.abs(d-m)<.01&&Math.abs(p-M)<.01&&Math.abs(y-x)<.01){if(Math.abs(d+m)<.1&&Math.abs(p+M)<.1&&Math.abs(y+x)<.1&&Math.abs(h+g+_-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(h+1)/2,T=(g+1)/2,O=(_+1)/2,P=(d+m)/4,L=(p+M)/4,z=(y+x)/4;return w>T&&w>O?w<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(w),i=P/n,s=L/n):T>O?T<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(T),n=P/i,s=z/i):O<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(O),n=L/s,i=z/s),this.set(n,i,s,t),this}let E=Math.sqrt((x-y)*(x-y)+(p-M)*(p-M)+(m-d)*(m-d));return Math.abs(E)<.001&&(E=1),this.x=(x-y)/E,this.y=(p-M)/E,this.z=(m-d)/E,this.w=Math.acos((h+g+_-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class P_ extends Yi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new yt(0,0,e,t),this.scissorTest=!1,this.viewport=new yt(0,0,e,t);const i={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:nn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const s=new Jt(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const l=n.count;for(let c=0;c<l;c++)this.textures[c]=s.clone(),this.textures[c].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new gs(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ti extends P_{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class sh extends Jt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=dn,this.minFilter=dn,this.wrapR=mi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class lM extends Ti{constructor(e=1,t=1,n=1,i={}){super(e,t,i),this.isWebGLArrayRenderTarget=!0,this.depth=n,this.texture=new sh(null,e,t,n),this.texture.isRenderTargetTexture=!0}}class xp extends Jt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=dn,this.minFilter=dn,this.wrapR=mi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class cM extends Ti{constructor(e=1,t=1,n=1,i={}){super(e,t,i),this.isWebGL3DRenderTarget=!0,this.depth=n,this.texture=new xp(null,e,t,n),this.texture.isRenderTargetTexture=!0}}class qn{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,l,c){let u=n[i+0],h=n[i+1],d=n[i+2],p=n[i+3];const m=s[l+0],g=s[l+1],y=s[l+2],M=s[l+3];if(c===0){e[t+0]=u,e[t+1]=h,e[t+2]=d,e[t+3]=p;return}if(c===1){e[t+0]=m,e[t+1]=g,e[t+2]=y,e[t+3]=M;return}if(p!==M||u!==m||h!==g||d!==y){let x=1-c;const _=u*m+h*g+d*y+p*M,E=_>=0?1:-1,w=1-_*_;if(w>Number.EPSILON){const O=Math.sqrt(w),P=Math.atan2(O,_*E);x=Math.sin(x*P)/O,c=Math.sin(c*P)/O}const T=c*E;if(u=u*x+m*T,h=h*x+g*T,d=d*x+y*T,p=p*x+M*T,x===1-c){const O=1/Math.sqrt(u*u+h*h+d*d+p*p);u*=O,h*=O,d*=O,p*=O}}e[t]=u,e[t+1]=h,e[t+2]=d,e[t+3]=p}static multiplyQuaternionsFlat(e,t,n,i,s,l){const c=n[i],u=n[i+1],h=n[i+2],d=n[i+3],p=s[l],m=s[l+1],g=s[l+2],y=s[l+3];return e[t]=c*y+d*p+u*g-h*m,e[t+1]=u*y+d*m+h*p-c*g,e[t+2]=h*y+d*g+c*m-u*p,e[t+3]=d*y-c*p-u*m-h*g,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,s=e._z,l=e._order,c=Math.cos,u=Math.sin,h=c(n/2),d=c(i/2),p=c(s/2),m=u(n/2),g=u(i/2),y=u(s/2);switch(l){case"XYZ":this._x=m*d*p+h*g*y,this._y=h*g*p-m*d*y,this._z=h*d*y+m*g*p,this._w=h*d*p-m*g*y;break;case"YXZ":this._x=m*d*p+h*g*y,this._y=h*g*p-m*d*y,this._z=h*d*y-m*g*p,this._w=h*d*p+m*g*y;break;case"ZXY":this._x=m*d*p-h*g*y,this._y=h*g*p+m*d*y,this._z=h*d*y+m*g*p,this._w=h*d*p-m*g*y;break;case"ZYX":this._x=m*d*p-h*g*y,this._y=h*g*p+m*d*y,this._z=h*d*y-m*g*p,this._w=h*d*p+m*g*y;break;case"YZX":this._x=m*d*p+h*g*y,this._y=h*g*p+m*d*y,this._z=h*d*y-m*g*p,this._w=h*d*p-m*g*y;break;case"XZY":this._x=m*d*p-h*g*y,this._y=h*g*p-m*d*y,this._z=h*d*y+m*g*p,this._w=h*d*p+m*g*y;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+l)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],s=t[8],l=t[1],c=t[5],u=t[9],h=t[2],d=t[6],p=t[10],m=n+c+p;if(m>0){const g=.5/Math.sqrt(m+1);this._w=.25/g,this._x=(d-u)*g,this._y=(s-h)*g,this._z=(l-i)*g}else if(n>c&&n>p){const g=2*Math.sqrt(1+n-c-p);this._w=(d-u)/g,this._x=.25*g,this._y=(i+l)/g,this._z=(s+h)/g}else if(c>p){const g=2*Math.sqrt(1+c-n-p);this._w=(s-h)/g,this._x=(i+l)/g,this._y=.25*g,this._z=(u+d)/g}else{const g=2*Math.sqrt(1+p-n-c);this._w=(l-i)/g,this._x=(s+h)/g,this._y=(u+d)/g,this._z=.25*g}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Zt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,s=e._z,l=e._w,c=t._x,u=t._y,h=t._z,d=t._w;return this._x=n*d+l*c+i*h-s*u,this._y=i*d+l*u+s*c-n*h,this._z=s*d+l*h+n*u-i*c,this._w=l*d-n*c-i*u-s*h,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,s=this._z,l=this._w;let c=l*e._w+n*e._x+i*e._y+s*e._z;if(c<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,c=-c):this.copy(e),c>=1)return this._w=l,this._x=n,this._y=i,this._z=s,this;const u=1-c*c;if(u<=Number.EPSILON){const g=1-t;return this._w=g*l+t*this._w,this._x=g*n+t*this._x,this._y=g*i+t*this._y,this._z=g*s+t*this._z,this.normalize(),this}const h=Math.sqrt(u),d=Math.atan2(h,c),p=Math.sin((1-t)*d)/h,m=Math.sin(t*d)/h;return this._w=l*p+this._w*m,this._x=n*p+this._x*m,this._y=i*p+this._y*m,this._z=s*p+this._z*m,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(e=0,t=0,n=0){D.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Fg.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Fg.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=e.elements,l=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*l,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*l,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*l,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,s=e.x,l=e.y,c=e.z,u=e.w,h=2*(l*i-c*n),d=2*(c*t-s*i),p=2*(s*n-l*t);return this.x=t+u*h+l*p-c*d,this.y=n+u*d+c*h-s*p,this.z=i+u*p+s*d-l*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,s=e.z,l=t.x,c=t.y,u=t.z;return this.x=i*u-s*c,this.y=s*l-n*u,this.z=n*c-i*l,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return kf.copy(this).projectOnVector(e),this.sub(kf)}reflect(e){return this.sub(kf.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Zt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const kf=new D,Fg=new qn;class pn{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(xi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(xi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=xi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let l=0,c=s.count;l<c;l++)e.isMesh===!0?e.getVertexPosition(l,xi):xi.fromBufferAttribute(s,l),xi.applyMatrix4(e.matrixWorld),this.expandByPoint(xi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),oc.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),oc.copy(n.boundingBox)),oc.applyMatrix4(e.matrixWorld),this.union(oc)}const i=e.children;for(let s=0,l=i.length;s<l;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,xi),xi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ea),ac.subVectors(this.max,ea),Js.subVectors(e.a,ea),Ks.subVectors(e.b,ea),js.subVectors(e.c,ea),br.subVectors(Ks,Js),Cr.subVectors(js,Ks),Qr.subVectors(Js,js);let t=[0,-br.z,br.y,0,-Cr.z,Cr.y,0,-Qr.z,Qr.y,br.z,0,-br.x,Cr.z,0,-Cr.x,Qr.z,0,-Qr.x,-br.y,br.x,0,-Cr.y,Cr.x,0,-Qr.y,Qr.x,0];return!Hf(t,Js,Ks,js,ac)||(t=[1,0,0,0,1,0,0,0,1],!Hf(t,Js,Ks,js,ac))?!1:(lc.crossVectors(br,Cr),t=[lc.x,lc.y,lc.z],Hf(t,Js,Ks,js,ac))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,xi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(xi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(tr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),tr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),tr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),tr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),tr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),tr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),tr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),tr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(tr),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const tr=[new D,new D,new D,new D,new D,new D,new D,new D],xi=new D,oc=new pn,Js=new D,Ks=new D,js=new D,br=new D,Cr=new D,Qr=new D,ea=new D,ac=new D,lc=new D,$r=new D;function Hf(r,e,t,n,i){for(let s=0,l=r.length-3;s<=l;s+=3){$r.fromArray(r,s);const c=i.x*Math.abs($r.x)+i.y*Math.abs($r.y)+i.z*Math.abs($r.z),u=e.dot($r),h=t.dot($r),d=n.dot($r);if(Math.max(-Math.max(u,h,d),Math.min(u,h,d))>c)return!1}return!0}const uM=new pn,ta=new D,Vf=new D;class mn{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):uM.setFromPoints(e).getCenter(n);let i=0;for(let s=0,l=e.length;s<l;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ta.subVectors(e,this.center);const t=ta.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(ta,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Vf.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ta.copy(e.center).add(Vf)),this.expandByPoint(ta.copy(e.center).sub(Vf))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const nr=new D,Gf=new D,cc=new D,Rr=new D,Wf=new D,uc=new D,Xf=new D;class Io{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,nr)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=nr.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(nr.copy(this.origin).addScaledVector(this.direction,t),nr.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Gf.copy(e).add(t).multiplyScalar(.5),cc.copy(t).sub(e).normalize(),Rr.copy(this.origin).sub(Gf);const s=e.distanceTo(t)*.5,l=-this.direction.dot(cc),c=Rr.dot(this.direction),u=-Rr.dot(cc),h=Rr.lengthSq(),d=Math.abs(1-l*l);let p,m,g,y;if(d>0)if(p=l*u-c,m=l*c-u,y=s*d,p>=0)if(m>=-y)if(m<=y){const M=1/d;p*=M,m*=M,g=p*(p+l*m+2*c)+m*(l*p+m+2*u)+h}else m=s,p=Math.max(0,-(l*m+c)),g=-p*p+m*(m+2*u)+h;else m=-s,p=Math.max(0,-(l*m+c)),g=-p*p+m*(m+2*u)+h;else m<=-y?(p=Math.max(0,-(-l*s+c)),m=p>0?-s:Math.min(Math.max(-s,-u),s),g=-p*p+m*(m+2*u)+h):m<=y?(p=0,m=Math.min(Math.max(-s,-u),s),g=m*(m+2*u)+h):(p=Math.max(0,-(l*s+c)),m=p>0?s:Math.min(Math.max(-s,-u),s),g=-p*p+m*(m+2*u)+h);else m=l>0?-s:s,p=Math.max(0,-(l*m+c)),g=-p*p+m*(m+2*u)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,p),i&&i.copy(Gf).addScaledVector(cc,m),g}intersectSphere(e,t){nr.subVectors(e.center,this.origin);const n=nr.dot(this.direction),i=nr.dot(nr)-n*n,s=e.radius*e.radius;if(i>s)return null;const l=Math.sqrt(s-i),c=n-l,u=n+l;return u<0?null:c<0?this.at(u,t):this.at(c,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,l,c,u;const h=1/this.direction.x,d=1/this.direction.y,p=1/this.direction.z,m=this.origin;return h>=0?(n=(e.min.x-m.x)*h,i=(e.max.x-m.x)*h):(n=(e.max.x-m.x)*h,i=(e.min.x-m.x)*h),d>=0?(s=(e.min.y-m.y)*d,l=(e.max.y-m.y)*d):(s=(e.max.y-m.y)*d,l=(e.min.y-m.y)*d),n>l||s>i||((s>n||isNaN(n))&&(n=s),(l<i||isNaN(i))&&(i=l),p>=0?(c=(e.min.z-m.z)*p,u=(e.max.z-m.z)*p):(c=(e.max.z-m.z)*p,u=(e.min.z-m.z)*p),n>u||c>i)||((c>n||n!==n)&&(n=c),(u<i||i!==i)&&(i=u),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,nr)!==null}intersectTriangle(e,t,n,i,s){Wf.subVectors(t,e),uc.subVectors(n,e),Xf.crossVectors(Wf,uc);let l=this.direction.dot(Xf),c;if(l>0){if(i)return null;c=1}else if(l<0)c=-1,l=-l;else return null;Rr.subVectors(this.origin,e);const u=c*this.direction.dot(uc.crossVectors(Rr,uc));if(u<0)return null;const h=c*this.direction.dot(Wf.cross(Rr));if(h<0||u+h>l)return null;const d=-c*Rr.dot(Xf);return d<0?null:this.at(d/l,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class et{constructor(e,t,n,i,s,l,c,u,h,d,p,m,g,y,M,x){et.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,l,c,u,h,d,p,m,g,y,M,x)}set(e,t,n,i,s,l,c,u,h,d,p,m,g,y,M,x){const _=this.elements;return _[0]=e,_[4]=t,_[8]=n,_[12]=i,_[1]=s,_[5]=l,_[9]=c,_[13]=u,_[2]=h,_[6]=d,_[10]=p,_[14]=m,_[3]=g,_[7]=y,_[11]=M,_[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new et().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/Qs.setFromMatrixColumn(e,0).length(),s=1/Qs.setFromMatrixColumn(e,1).length(),l=1/Qs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*l,t[9]=n[9]*l,t[10]=n[10]*l,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,s=e.z,l=Math.cos(n),c=Math.sin(n),u=Math.cos(i),h=Math.sin(i),d=Math.cos(s),p=Math.sin(s);if(e.order==="XYZ"){const m=l*d,g=l*p,y=c*d,M=c*p;t[0]=u*d,t[4]=-u*p,t[8]=h,t[1]=g+y*h,t[5]=m-M*h,t[9]=-c*u,t[2]=M-m*h,t[6]=y+g*h,t[10]=l*u}else if(e.order==="YXZ"){const m=u*d,g=u*p,y=h*d,M=h*p;t[0]=m+M*c,t[4]=y*c-g,t[8]=l*h,t[1]=l*p,t[5]=l*d,t[9]=-c,t[2]=g*c-y,t[6]=M+m*c,t[10]=l*u}else if(e.order==="ZXY"){const m=u*d,g=u*p,y=h*d,M=h*p;t[0]=m-M*c,t[4]=-l*p,t[8]=y+g*c,t[1]=g+y*c,t[5]=l*d,t[9]=M-m*c,t[2]=-l*h,t[6]=c,t[10]=l*u}else if(e.order==="ZYX"){const m=l*d,g=l*p,y=c*d,M=c*p;t[0]=u*d,t[4]=y*h-g,t[8]=m*h+M,t[1]=u*p,t[5]=M*h+m,t[9]=g*h-y,t[2]=-h,t[6]=c*u,t[10]=l*u}else if(e.order==="YZX"){const m=l*u,g=l*h,y=c*u,M=c*h;t[0]=u*d,t[4]=M-m*p,t[8]=y*p+g,t[1]=p,t[5]=l*d,t[9]=-c*d,t[2]=-h*d,t[6]=g*p+y,t[10]=m-M*p}else if(e.order==="XZY"){const m=l*u,g=l*h,y=c*u,M=c*h;t[0]=u*d,t[4]=-p,t[8]=h*d,t[1]=m*p+M,t[5]=l*d,t[9]=g*p-y,t[2]=y*p-g,t[6]=c*d,t[10]=M*p+m}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(hM,e,fM)}lookAt(e,t,n){const i=this.elements;return ei.subVectors(e,t),ei.lengthSq()===0&&(ei.z=1),ei.normalize(),Pr.crossVectors(n,ei),Pr.lengthSq()===0&&(Math.abs(n.z)===1?ei.x+=1e-4:ei.z+=1e-4,ei.normalize(),Pr.crossVectors(n,ei)),Pr.normalize(),hc.crossVectors(ei,Pr),i[0]=Pr.x,i[4]=hc.x,i[8]=ei.x,i[1]=Pr.y,i[5]=hc.y,i[9]=ei.y,i[2]=Pr.z,i[6]=hc.z,i[10]=ei.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,l=n[0],c=n[4],u=n[8],h=n[12],d=n[1],p=n[5],m=n[9],g=n[13],y=n[2],M=n[6],x=n[10],_=n[14],E=n[3],w=n[7],T=n[11],O=n[15],P=i[0],L=i[4],z=i[8],X=i[12],b=i[1],C=i[5],G=i[9],q=i[13],Q=i[2],ae=i[6],K=i[10],me=i[14],F=i[3],J=i[7],Z=i[11],ie=i[15];return s[0]=l*P+c*b+u*Q+h*F,s[4]=l*L+c*C+u*ae+h*J,s[8]=l*z+c*G+u*K+h*Z,s[12]=l*X+c*q+u*me+h*ie,s[1]=d*P+p*b+m*Q+g*F,s[5]=d*L+p*C+m*ae+g*J,s[9]=d*z+p*G+m*K+g*Z,s[13]=d*X+p*q+m*me+g*ie,s[2]=y*P+M*b+x*Q+_*F,s[6]=y*L+M*C+x*ae+_*J,s[10]=y*z+M*G+x*K+_*Z,s[14]=y*X+M*q+x*me+_*ie,s[3]=E*P+w*b+T*Q+O*F,s[7]=E*L+w*C+T*ae+O*J,s[11]=E*z+w*G+T*K+O*Z,s[15]=E*X+w*q+T*me+O*ie,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],l=e[1],c=e[5],u=e[9],h=e[13],d=e[2],p=e[6],m=e[10],g=e[14],y=e[3],M=e[7],x=e[11],_=e[15];return y*(+s*u*p-i*h*p-s*c*m+n*h*m+i*c*g-n*u*g)+M*(+t*u*g-t*h*m+s*l*m-i*l*g+i*h*d-s*u*d)+x*(+t*h*p-t*c*g-s*l*p+n*l*g+s*c*d-n*h*d)+_*(-i*c*d-t*u*p+t*c*m+i*l*p-n*l*m+n*u*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],l=e[4],c=e[5],u=e[6],h=e[7],d=e[8],p=e[9],m=e[10],g=e[11],y=e[12],M=e[13],x=e[14],_=e[15],E=p*x*h-M*m*h+M*u*g-c*x*g-p*u*_+c*m*_,w=y*m*h-d*x*h-y*u*g+l*x*g+d*u*_-l*m*_,T=d*M*h-y*p*h+y*c*g-l*M*g-d*c*_+l*p*_,O=y*p*u-d*M*u-y*c*m+l*M*m+d*c*x-l*p*x,P=t*E+n*w+i*T+s*O;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const L=1/P;return e[0]=E*L,e[1]=(M*m*s-p*x*s-M*i*g+n*x*g+p*i*_-n*m*_)*L,e[2]=(c*x*s-M*u*s+M*i*h-n*x*h-c*i*_+n*u*_)*L,e[3]=(p*u*s-c*m*s-p*i*h+n*m*h+c*i*g-n*u*g)*L,e[4]=w*L,e[5]=(d*x*s-y*m*s+y*i*g-t*x*g-d*i*_+t*m*_)*L,e[6]=(y*u*s-l*x*s-y*i*h+t*x*h+l*i*_-t*u*_)*L,e[7]=(l*m*s-d*u*s+d*i*h-t*m*h-l*i*g+t*u*g)*L,e[8]=T*L,e[9]=(y*p*s-d*M*s-y*n*g+t*M*g+d*n*_-t*p*_)*L,e[10]=(l*M*s-y*c*s+y*n*h-t*M*h-l*n*_+t*c*_)*L,e[11]=(d*c*s-l*p*s-d*n*h+t*p*h+l*n*g-t*c*g)*L,e[12]=O*L,e[13]=(d*M*i-y*p*i+y*n*m-t*M*m-d*n*x+t*p*x)*L,e[14]=(y*c*i-l*M*i-y*n*u+t*M*u+l*n*x-t*c*x)*L,e[15]=(l*p*i-d*c*i+d*n*u-t*p*u-l*n*m+t*c*m)*L,this}scale(e){const t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),s=1-n,l=e.x,c=e.y,u=e.z,h=s*l,d=s*c;return this.set(h*l+n,h*c-i*u,h*u+i*c,0,h*c+i*u,d*c+n,d*u-i*l,0,h*u-i*c,d*u+i*l,s*u*u+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,l){return this.set(1,n,s,0,e,1,l,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,s=t._x,l=t._y,c=t._z,u=t._w,h=s+s,d=l+l,p=c+c,m=s*h,g=s*d,y=s*p,M=l*d,x=l*p,_=c*p,E=u*h,w=u*d,T=u*p,O=n.x,P=n.y,L=n.z;return i[0]=(1-(M+_))*O,i[1]=(g+T)*O,i[2]=(y-w)*O,i[3]=0,i[4]=(g-T)*P,i[5]=(1-(m+_))*P,i[6]=(x+E)*P,i[7]=0,i[8]=(y+w)*L,i[9]=(x-E)*L,i[10]=(1-(m+M))*L,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let s=Qs.set(i[0],i[1],i[2]).length();const l=Qs.set(i[4],i[5],i[6]).length(),c=Qs.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),e.x=i[12],e.y=i[13],e.z=i[14],Si.copy(this);const h=1/s,d=1/l,p=1/c;return Si.elements[0]*=h,Si.elements[1]*=h,Si.elements[2]*=h,Si.elements[4]*=d,Si.elements[5]*=d,Si.elements[6]*=d,Si.elements[8]*=p,Si.elements[9]*=p,Si.elements[10]*=p,t.setFromRotationMatrix(Si),n.x=s,n.y=l,n.z=c,this}makePerspective(e,t,n,i,s,l,c=Vi){const u=this.elements,h=2*s/(t-e),d=2*s/(n-i),p=(t+e)/(t-e),m=(n+i)/(n-i);let g,y;if(c===Vi)g=-(l+s)/(l-s),y=-2*l*s/(l-s);else if(c===Fa)g=-l/(l-s),y=-l*s/(l-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+c);return u[0]=h,u[4]=0,u[8]=p,u[12]=0,u[1]=0,u[5]=d,u[9]=m,u[13]=0,u[2]=0,u[6]=0,u[10]=g,u[14]=y,u[3]=0,u[7]=0,u[11]=-1,u[15]=0,this}makeOrthographic(e,t,n,i,s,l,c=Vi){const u=this.elements,h=1/(t-e),d=1/(n-i),p=1/(l-s),m=(t+e)*h,g=(n+i)*d;let y,M;if(c===Vi)y=(l+s)*p,M=-2*p;else if(c===Fa)y=s*p,M=-1*p;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+c);return u[0]=2*h,u[4]=0,u[8]=0,u[12]=-m,u[1]=0,u[5]=2*d,u[9]=0,u[13]=-g,u[2]=0,u[6]=0,u[10]=M,u[14]=-y,u[3]=0,u[7]=0,u[11]=0,u[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Qs=new D,Si=new et,hM=new D(0,0,0),fM=new D(1,1,1),Pr=new D,hc=new D,ei=new D,Bg=new et,zg=new qn;class ri{constructor(e=0,t=0,n=0,i=ri.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,s=i[0],l=i[4],c=i[8],u=i[1],h=i[5],d=i[9],p=i[2],m=i[6],g=i[10];switch(t){case"XYZ":this._y=Math.asin(Zt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,g),this._z=Math.atan2(-l,s)):(this._x=Math.atan2(m,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Zt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(c,g),this._z=Math.atan2(u,h)):(this._y=Math.atan2(-p,s),this._z=0);break;case"ZXY":this._x=Math.asin(Zt(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-p,g),this._z=Math.atan2(-l,h)):(this._y=0,this._z=Math.atan2(u,s));break;case"ZYX":this._y=Math.asin(-Zt(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(m,g),this._z=Math.atan2(u,s)):(this._x=0,this._z=Math.atan2(-l,h));break;case"YZX":this._z=Math.asin(Zt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(-d,h),this._y=Math.atan2(-p,s)):(this._x=0,this._y=Math.atan2(c,g));break;case"XZY":this._z=Math.asin(-Zt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(m,h),this._y=Math.atan2(c,s)):(this._x=Math.atan2(-d,g),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Bg.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Bg,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return zg.setFromEuler(this),this.setFromQuaternion(zg,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ri.DEFAULT_ORDER="XYZ";class Ss{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let dM=0;const kg=new D,$s=new qn,ir=new et,fc=new D,na=new D,pM=new D,mM=new qn,Hg=new D(1,0,0),Vg=new D(0,1,0),Gg=new D(0,0,1),Wg={type:"added"},gM={type:"removed"},eo={type:"childadded",child:null},Yf={type:"childremoved",child:null};class bt extends Yi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:dM++}),this.uuid=ii(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=bt.DEFAULT_UP.clone();const e=new D,t=new ri,n=new qn,i=new D(1,1,1);function s(){n.setFromEuler(t,!1)}function l(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(l),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new et},normalMatrix:{value:new ft}}),this.matrix=new et,this.matrixWorld=new et,this.matrixAutoUpdate=bt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=bt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ss,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return $s.setFromAxisAngle(e,t),this.quaternion.multiply($s),this}rotateOnWorldAxis(e,t){return $s.setFromAxisAngle(e,t),this.quaternion.premultiply($s),this}rotateX(e){return this.rotateOnAxis(Hg,e)}rotateY(e){return this.rotateOnAxis(Vg,e)}rotateZ(e){return this.rotateOnAxis(Gg,e)}translateOnAxis(e,t){return kg.copy(e).applyQuaternion(this.quaternion),this.position.add(kg.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Hg,e)}translateY(e){return this.translateOnAxis(Vg,e)}translateZ(e){return this.translateOnAxis(Gg,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ir.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?fc.copy(e):fc.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),na.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ir.lookAt(na,fc,this.up):ir.lookAt(fc,na,this.up),this.quaternion.setFromRotationMatrix(ir),i&&(ir.extractRotation(i.matrixWorld),$s.setFromRotationMatrix(ir),this.quaternion.premultiply($s.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Wg),eo.child=e,this.dispatchEvent(eo),eo.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(gM),Yf.child=e,this.dispatchEvent(Yf),Yf.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ir.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ir.multiply(e.parent.matrixWorld)),e.applyMatrix4(ir),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Wg),eo.child=e,this.dispatchEvent(eo),eo.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const l=this.children[n].getObjectByProperty(e,t);if(l!==void 0)return l}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(na,e,pM),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(na,mM,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(c=>({boxInitialized:c.boxInitialized,boxMin:c.box.min.toArray(),boxMax:c.box.max.toArray(),sphereInitialized:c.sphereInitialized,sphereRadius:c.sphere.radius,sphereCenter:c.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function s(c,u){return c[u.uuid]===void 0&&(c[u.uuid]=u.toJSON(e)),u.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);const c=this.geometry.parameters;if(c!==void 0&&c.shapes!==void 0){const u=c.shapes;if(Array.isArray(u))for(let h=0,d=u.length;h<d;h++){const p=u[h];s(e.shapes,p)}else s(e.shapes,u)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const c=[];for(let u=0,h=this.material.length;u<h;u++)c.push(s(e.materials,this.material[u]));i.material=c}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let c=0;c<this.children.length;c++)i.children.push(this.children[c].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let c=0;c<this.animations.length;c++){const u=this.animations[c];i.animations.push(s(e.animations,u))}}if(t){const c=l(e.geometries),u=l(e.materials),h=l(e.textures),d=l(e.images),p=l(e.shapes),m=l(e.skeletons),g=l(e.animations),y=l(e.nodes);c.length>0&&(n.geometries=c),u.length>0&&(n.materials=u),h.length>0&&(n.textures=h),d.length>0&&(n.images=d),p.length>0&&(n.shapes=p),m.length>0&&(n.skeletons=m),g.length>0&&(n.animations=g),y.length>0&&(n.nodes=y)}return n.object=i,n;function l(c){const u=[];for(const h in c){const d=c[h];delete d.metadata,u.push(d)}return u}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}bt.DEFAULT_UP=new D(0,1,0);bt.DEFAULT_MATRIX_AUTO_UPDATE=!0;bt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Mi=new D,rr=new D,qf=new D,sr=new D,to=new D,no=new D,Xg=new D,Zf=new D,Jf=new D,Kf=new D,jf=new yt,Qf=new yt,$f=new yt;class Xn{constructor(e=new D,t=new D,n=new D){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Mi.subVectors(e,t),i.cross(Mi);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){Mi.subVectors(i,t),rr.subVectors(n,t),qf.subVectors(e,t);const l=Mi.dot(Mi),c=Mi.dot(rr),u=Mi.dot(qf),h=rr.dot(rr),d=rr.dot(qf),p=l*h-c*c;if(p===0)return s.set(0,0,0),null;const m=1/p,g=(h*u-c*d)*m,y=(l*d-c*u)*m;return s.set(1-g-y,y,g)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,sr)===null?!1:sr.x>=0&&sr.y>=0&&sr.x+sr.y<=1}static getInterpolation(e,t,n,i,s,l,c,u){return this.getBarycoord(e,t,n,i,sr)===null?(u.x=0,u.y=0,"z"in u&&(u.z=0),"w"in u&&(u.w=0),null):(u.setScalar(0),u.addScaledVector(s,sr.x),u.addScaledVector(l,sr.y),u.addScaledVector(c,sr.z),u)}static getInterpolatedAttribute(e,t,n,i,s,l){return jf.setScalar(0),Qf.setScalar(0),$f.setScalar(0),jf.fromBufferAttribute(e,t),Qf.fromBufferAttribute(e,n),$f.fromBufferAttribute(e,i),l.setScalar(0),l.addScaledVector(jf,s.x),l.addScaledVector(Qf,s.y),l.addScaledVector($f,s.z),l}static isFrontFacing(e,t,n,i){return Mi.subVectors(n,t),rr.subVectors(e,t),Mi.cross(rr).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Mi.subVectors(this.c,this.b),rr.subVectors(this.a,this.b),Mi.cross(rr).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Xn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Xn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return Xn.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return Xn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Xn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,s=this.c;let l,c;to.subVectors(i,n),no.subVectors(s,n),Zf.subVectors(e,n);const u=to.dot(Zf),h=no.dot(Zf);if(u<=0&&h<=0)return t.copy(n);Jf.subVectors(e,i);const d=to.dot(Jf),p=no.dot(Jf);if(d>=0&&p<=d)return t.copy(i);const m=u*p-d*h;if(m<=0&&u>=0&&d<=0)return l=u/(u-d),t.copy(n).addScaledVector(to,l);Kf.subVectors(e,s);const g=to.dot(Kf),y=no.dot(Kf);if(y>=0&&g<=y)return t.copy(s);const M=g*h-u*y;if(M<=0&&h>=0&&y<=0)return c=h/(h-y),t.copy(n).addScaledVector(no,c);const x=d*y-g*p;if(x<=0&&p-d>=0&&g-y>=0)return Xg.subVectors(s,i),c=(p-d)/(p-d+(g-y)),t.copy(i).addScaledVector(Xg,c);const _=1/(x+M+m);return l=M*_,c=m*_,t.copy(n).addScaledVector(to,l).addScaledVector(no,c)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const I_={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ir={h:0,s:0,l:0},dc={h:0,s:0,l:0};function ed(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}class Ie{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Wn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Lt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=Lt.workingColorSpace){return this.r=e,this.g=t,this.b=n,Lt.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=Lt.workingColorSpace){if(e=yp(e,1),t=Zt(t,0,1),n=Zt(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,l=2*n-s;this.r=ed(l,s,e+1/3),this.g=ed(l,s,e),this.b=ed(l,s,e-1/3)}return Lt.toWorkingColorSpace(this,i),this}setStyle(e,t=Wn){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const l=i[1],c=i[2];switch(l){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=i[1],l=s.length;if(l===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(l===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Wn){const n=I_[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=wo(e.r),this.g=wo(e.g),this.b=wo(e.b),this}copyLinearToSRGB(e){return this.r=Bf(e.r),this.g=Bf(e.g),this.b=Bf(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Wn){return Lt.fromWorkingColorSpace(bn.copy(this),e),Math.round(Zt(bn.r*255,0,255))*65536+Math.round(Zt(bn.g*255,0,255))*256+Math.round(Zt(bn.b*255,0,255))}getHexString(e=Wn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Lt.workingColorSpace){Lt.fromWorkingColorSpace(bn.copy(this),t);const n=bn.r,i=bn.g,s=bn.b,l=Math.max(n,i,s),c=Math.min(n,i,s);let u,h;const d=(c+l)/2;if(c===l)u=0,h=0;else{const p=l-c;switch(h=d<=.5?p/(l+c):p/(2-l-c),l){case n:u=(i-s)/p+(i<s?6:0);break;case i:u=(s-n)/p+2;break;case s:u=(n-i)/p+4;break}u/=6}return e.h=u,e.s=h,e.l=d,e}getRGB(e,t=Lt.workingColorSpace){return Lt.fromWorkingColorSpace(bn.copy(this),t),e.r=bn.r,e.g=bn.g,e.b=bn.b,e}getStyle(e=Wn){Lt.fromWorkingColorSpace(bn.copy(this),e);const t=bn.r,n=bn.g,i=bn.b;return e!==Wn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Ir),this.setHSL(Ir.h+e,Ir.s+t,Ir.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ir),e.getHSL(dc);const n=Ea(Ir.h,dc.h,t),i=Ea(Ir.s,dc.s,t),s=Ea(Ir.l,dc.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const bn=new Ie;Ie.NAMES=I_;let vM=0;class Pn extends Yi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:vM++}),this.uuid=ii(),this.name="",this.type="Material",this.blending=_s,this.side=fr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ou,this.blendDst=au,this.blendEquation=Or,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ie(0,0,0),this.blendAlpha=0,this.depthFunc=Es,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=qd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=us,this.stencilZFail=us,this.stencilZPass=us,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==_s&&(n.blending=this.blending),this.side!==fr&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ou&&(n.blendSrc=this.blendSrc),this.blendDst!==au&&(n.blendDst=this.blendDst),this.blendEquation!==Or&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Es&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==qd&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==us&&(n.stencilFail=this.stencilFail),this.stencilZFail!==us&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==us&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const l=[];for(const c in s){const u=s[c];delete u.metadata,l.push(u)}return l}if(t){const s=i(e.textures),l=i(e.images);s.length>0&&(n.textures=s),l.length>0&&(n.images=l)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class kr extends Pn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ie(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ri,this.combine=Za,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const lr=_M();function _M(){const r=new ArrayBuffer(4),e=new Float32Array(r),t=new Uint32Array(r),n=new Uint32Array(512),i=new Uint32Array(512);for(let u=0;u<256;++u){const h=u-127;h<-27?(n[u]=0,n[u|256]=32768,i[u]=24,i[u|256]=24):h<-14?(n[u]=1024>>-h-14,n[u|256]=1024>>-h-14|32768,i[u]=-h-1,i[u|256]=-h-1):h<=15?(n[u]=h+15<<10,n[u|256]=h+15<<10|32768,i[u]=13,i[u|256]=13):h<128?(n[u]=31744,n[u|256]=64512,i[u]=24,i[u|256]=24):(n[u]=31744,n[u|256]=64512,i[u]=13,i[u|256]=13)}const s=new Uint32Array(2048),l=new Uint32Array(64),c=new Uint32Array(64);for(let u=1;u<1024;++u){let h=u<<13,d=0;for(;!(h&8388608);)h<<=1,d-=8388608;h&=-8388609,d+=947912704,s[u]=h|d}for(let u=1024;u<2048;++u)s[u]=939524096+(u-1024<<13);for(let u=1;u<31;++u)l[u]=u<<23;l[31]=1199570944,l[32]=2147483648;for(let u=33;u<63;++u)l[u]=2147483648+(u-32<<23);l[63]=3347054592;for(let u=1;u<64;++u)u!==32&&(c[u]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:i,mantissaTable:s,exponentTable:l,offsetTable:c}}function Gn(r){Math.abs(r)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),r=Zt(r,-65504,65504),lr.floatView[0]=r;const e=lr.uint32View[0],t=e>>23&511;return lr.baseTable[t]+((e&8388607)>>lr.shiftTable[t])}function pa(r){const e=r>>10;return lr.uint32View[0]=lr.mantissaTable[lr.offsetTable[e]+(r&1023)]+lr.exponentTable[e],lr.floatView[0]}const yM={toHalfFloat:Gn,fromHalfFloat:pa},tn=new D,pc=new fe;class Nt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Oa,this.updateRanges=[],this.gpuType=Yn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)pc.fromBufferAttribute(this,t),pc.applyMatrix3(e),this.setXY(t,pc.x,pc.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)tn.fromBufferAttribute(this,t),tn.applyMatrix3(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)tn.fromBufferAttribute(this,t),tn.applyMatrix4(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)tn.fromBufferAttribute(this,t),tn.applyNormalMatrix(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)tn.fromBufferAttribute(this,t),tn.transformDirection(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Fn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=dt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Fn(t,this.array)),t}setX(e,t){return this.normalized&&(t=dt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Fn(t,this.array)),t}setY(e,t){return this.normalized&&(t=dt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Fn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=dt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Fn(t,this.array)),t}setW(e,t){return this.normalized&&(t=dt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=dt(t,this.array),n=dt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=dt(t,this.array),n=dt(n,this.array),i=dt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=dt(t,this.array),n=dt(n,this.array),i=dt(i,this.array),s=dt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Oa&&(e.usage=this.usage),e}}class xM extends Nt{constructor(e,t,n){super(new Int8Array(e),t,n)}}class SM extends Nt{constructor(e,t,n){super(new Uint8Array(e),t,n)}}class MM extends Nt{constructor(e,t,n){super(new Uint8ClampedArray(e),t,n)}}class wM extends Nt{constructor(e,t,n){super(new Int16Array(e),t,n)}}class Sp extends Nt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class EM extends Nt{constructor(e,t,n){super(new Int32Array(e),t,n)}}class Mp extends Nt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class AM extends Nt{constructor(e,t,n){super(new Uint16Array(e),t,n),this.isFloat16BufferAttribute=!0}getX(e){let t=pa(this.array[e*this.itemSize]);return this.normalized&&(t=Fn(t,this.array)),t}setX(e,t){return this.normalized&&(t=dt(t,this.array)),this.array[e*this.itemSize]=Gn(t),this}getY(e){let t=pa(this.array[e*this.itemSize+1]);return this.normalized&&(t=Fn(t,this.array)),t}setY(e,t){return this.normalized&&(t=dt(t,this.array)),this.array[e*this.itemSize+1]=Gn(t),this}getZ(e){let t=pa(this.array[e*this.itemSize+2]);return this.normalized&&(t=Fn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=dt(t,this.array)),this.array[e*this.itemSize+2]=Gn(t),this}getW(e){let t=pa(this.array[e*this.itemSize+3]);return this.normalized&&(t=Fn(t,this.array)),t}setW(e,t){return this.normalized&&(t=dt(t,this.array)),this.array[e*this.itemSize+3]=Gn(t),this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=dt(t,this.array),n=dt(n,this.array)),this.array[e+0]=Gn(t),this.array[e+1]=Gn(n),this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=dt(t,this.array),n=dt(n,this.array),i=dt(i,this.array)),this.array[e+0]=Gn(t),this.array[e+1]=Gn(n),this.array[e+2]=Gn(i),this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=dt(t,this.array),n=dt(n,this.array),i=dt(i,this.array),s=dt(s,this.array)),this.array[e+0]=Gn(t),this.array[e+1]=Gn(n),this.array[e+2]=Gn(i),this.array[e+3]=Gn(s),this}}class Xe extends Nt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let TM=0;const pi=new et,td=new bt,io=new D,ti=new pn,ia=new pn,hn=new D;class gt extends Yi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:TM++}),this.uuid=ii(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(b_(e)?Mp:Sp)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new ft().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return pi.makeRotationFromQuaternion(e),this.applyMatrix4(pi),this}rotateX(e){return pi.makeRotationX(e),this.applyMatrix4(pi),this}rotateY(e){return pi.makeRotationY(e),this.applyMatrix4(pi),this}rotateZ(e){return pi.makeRotationZ(e),this.applyMatrix4(pi),this}translate(e,t,n){return pi.makeTranslation(e,t,n),this.applyMatrix4(pi),this}scale(e,t,n){return pi.makeScale(e,t,n),this.applyMatrix4(pi),this}lookAt(e){return td.lookAt(e),td.updateMatrix(),this.applyMatrix4(td.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(io).negate(),this.translate(io.x,io.y,io.z),this}setFromPoints(e){const t=[];for(let n=0,i=e.length;n<i;n++){const s=e[n];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new Xe(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new pn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const s=t[n];ti.setFromBufferAttribute(s),this.morphTargetsRelative?(hn.addVectors(this.boundingBox.min,ti.min),this.boundingBox.expandByPoint(hn),hn.addVectors(this.boundingBox.max,ti.max),this.boundingBox.expandByPoint(hn)):(this.boundingBox.expandByPoint(ti.min),this.boundingBox.expandByPoint(ti.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new mn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const n=this.boundingSphere.center;if(ti.setFromBufferAttribute(e),t)for(let s=0,l=t.length;s<l;s++){const c=t[s];ia.setFromBufferAttribute(c),this.morphTargetsRelative?(hn.addVectors(ti.min,ia.min),ti.expandByPoint(hn),hn.addVectors(ti.max,ia.max),ti.expandByPoint(hn)):(ti.expandByPoint(ia.min),ti.expandByPoint(ia.max))}ti.getCenter(n);let i=0;for(let s=0,l=e.count;s<l;s++)hn.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(hn));if(t)for(let s=0,l=t.length;s<l;s++){const c=t[s],u=this.morphTargetsRelative;for(let h=0,d=c.count;h<d;h++)hn.fromBufferAttribute(c,h),u&&(io.fromBufferAttribute(e,h),hn.add(io)),i=Math.max(i,n.distanceToSquared(hn))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Nt(new Float32Array(4*n.count),4));const l=this.getAttribute("tangent"),c=[],u=[];for(let z=0;z<n.count;z++)c[z]=new D,u[z]=new D;const h=new D,d=new D,p=new D,m=new fe,g=new fe,y=new fe,M=new D,x=new D;function _(z,X,b){h.fromBufferAttribute(n,z),d.fromBufferAttribute(n,X),p.fromBufferAttribute(n,b),m.fromBufferAttribute(s,z),g.fromBufferAttribute(s,X),y.fromBufferAttribute(s,b),d.sub(h),p.sub(h),g.sub(m),y.sub(m);const C=1/(g.x*y.y-y.x*g.y);isFinite(C)&&(M.copy(d).multiplyScalar(y.y).addScaledVector(p,-g.y).multiplyScalar(C),x.copy(p).multiplyScalar(g.x).addScaledVector(d,-y.x).multiplyScalar(C),c[z].add(M),c[X].add(M),c[b].add(M),u[z].add(x),u[X].add(x),u[b].add(x))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let z=0,X=E.length;z<X;++z){const b=E[z],C=b.start,G=b.count;for(let q=C,Q=C+G;q<Q;q+=3)_(e.getX(q+0),e.getX(q+1),e.getX(q+2))}const w=new D,T=new D,O=new D,P=new D;function L(z){O.fromBufferAttribute(i,z),P.copy(O);const X=c[z];w.copy(X),w.sub(O.multiplyScalar(O.dot(X))).normalize(),T.crossVectors(P,X);const C=T.dot(u[z])<0?-1:1;l.setXYZW(z,w.x,w.y,w.z,C)}for(let z=0,X=E.length;z<X;++z){const b=E[z],C=b.start,G=b.count;for(let q=C,Q=C+G;q<Q;q+=3)L(e.getX(q+0)),L(e.getX(q+1)),L(e.getX(q+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Nt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let m=0,g=n.count;m<g;m++)n.setXYZ(m,0,0,0);const i=new D,s=new D,l=new D,c=new D,u=new D,h=new D,d=new D,p=new D;if(e)for(let m=0,g=e.count;m<g;m+=3){const y=e.getX(m+0),M=e.getX(m+1),x=e.getX(m+2);i.fromBufferAttribute(t,y),s.fromBufferAttribute(t,M),l.fromBufferAttribute(t,x),d.subVectors(l,s),p.subVectors(i,s),d.cross(p),c.fromBufferAttribute(n,y),u.fromBufferAttribute(n,M),h.fromBufferAttribute(n,x),c.add(d),u.add(d),h.add(d),n.setXYZ(y,c.x,c.y,c.z),n.setXYZ(M,u.x,u.y,u.z),n.setXYZ(x,h.x,h.y,h.z)}else for(let m=0,g=t.count;m<g;m+=3)i.fromBufferAttribute(t,m+0),s.fromBufferAttribute(t,m+1),l.fromBufferAttribute(t,m+2),d.subVectors(l,s),p.subVectors(i,s),d.cross(p),n.setXYZ(m+0,d.x,d.y,d.z),n.setXYZ(m+1,d.x,d.y,d.z),n.setXYZ(m+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)hn.fromBufferAttribute(e,t),hn.normalize(),e.setXYZ(t,hn.x,hn.y,hn.z)}toNonIndexed(){function e(c,u){const h=c.array,d=c.itemSize,p=c.normalized,m=new h.constructor(u.length*d);let g=0,y=0;for(let M=0,x=u.length;M<x;M++){c.isInterleavedBufferAttribute?g=u[M]*c.data.stride+c.offset:g=u[M]*d;for(let _=0;_<d;_++)m[y++]=h[g++]}return new Nt(m,d,p)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new gt,n=this.index.array,i=this.attributes;for(const c in i){const u=i[c],h=e(u,n);t.setAttribute(c,h)}const s=this.morphAttributes;for(const c in s){const u=[],h=s[c];for(let d=0,p=h.length;d<p;d++){const m=h[d],g=e(m,n);u.push(g)}t.morphAttributes[c]=u}t.morphTargetsRelative=this.morphTargetsRelative;const l=this.groups;for(let c=0,u=l.length;c<u;c++){const h=l[c];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const u=this.parameters;for(const h in u)u[h]!==void 0&&(e[h]=u[h]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const u in n){const h=n[u];e.data.attributes[u]=h.toJSON(e.data)}const i={};let s=!1;for(const u in this.morphAttributes){const h=this.morphAttributes[u],d=[];for(let p=0,m=h.length;p<m;p++){const g=h[p];d.push(g.toJSON(e.data))}d.length>0&&(i[u]=d,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const l=this.groups;l.length>0&&(e.data.groups=JSON.parse(JSON.stringify(l)));const c=this.boundingSphere;return c!==null&&(e.data.boundingSphere={center:c.center.toArray(),radius:c.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const h in i){const d=i[h];this.setAttribute(h,d.clone(t))}const s=e.morphAttributes;for(const h in s){const d=[],p=s[h];for(let m=0,g=p.length;m<g;m++)d.push(p[m].clone(t));this.morphAttributes[h]=d}this.morphTargetsRelative=e.morphTargetsRelative;const l=e.groups;for(let h=0,d=l.length;h<d;h++){const p=l[h];this.addGroup(p.start,p.count,p.materialIndex)}const c=e.boundingBox;c!==null&&(this.boundingBox=c.clone());const u=e.boundingSphere;return u!==null&&(this.boundingSphere=u.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Yg=new et,es=new Io,mc=new mn,qg=new D,gc=new D,vc=new D,_c=new D,nd=new D,yc=new D,Zg=new D,xc=new D;class Qt extends bt{constructor(e=new gt,t=new kr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,l=i.length;s<l;s++){const c=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[c]=s}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,l=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const c=this.morphTargetInfluences;if(s&&c){yc.set(0,0,0);for(let u=0,h=s.length;u<h;u++){const d=c[u],p=s[u];d!==0&&(nd.fromBufferAttribute(p,e),l?yc.addScaledVector(nd,d):yc.addScaledVector(nd.sub(t),d))}t.add(yc)}return t}raycast(e,t){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),mc.copy(n.boundingSphere),mc.applyMatrix4(s),es.copy(e.ray).recast(e.near),!(mc.containsPoint(es.origin)===!1&&(es.intersectSphere(mc,qg)===null||es.origin.distanceToSquared(qg)>(e.far-e.near)**2))&&(Yg.copy(s).invert(),es.copy(e.ray).applyMatrix4(Yg),!(n.boundingBox!==null&&es.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,es)))}_computeIntersections(e,t,n){let i;const s=this.geometry,l=this.material,c=s.index,u=s.attributes.position,h=s.attributes.uv,d=s.attributes.uv1,p=s.attributes.normal,m=s.groups,g=s.drawRange;if(c!==null)if(Array.isArray(l))for(let y=0,M=m.length;y<M;y++){const x=m[y],_=l[x.materialIndex],E=Math.max(x.start,g.start),w=Math.min(c.count,Math.min(x.start+x.count,g.start+g.count));for(let T=E,O=w;T<O;T+=3){const P=c.getX(T),L=c.getX(T+1),z=c.getX(T+2);i=Sc(this,_,e,n,h,d,p,P,L,z),i&&(i.faceIndex=Math.floor(T/3),i.face.materialIndex=x.materialIndex,t.push(i))}}else{const y=Math.max(0,g.start),M=Math.min(c.count,g.start+g.count);for(let x=y,_=M;x<_;x+=3){const E=c.getX(x),w=c.getX(x+1),T=c.getX(x+2);i=Sc(this,l,e,n,h,d,p,E,w,T),i&&(i.faceIndex=Math.floor(x/3),t.push(i))}}else if(u!==void 0)if(Array.isArray(l))for(let y=0,M=m.length;y<M;y++){const x=m[y],_=l[x.materialIndex],E=Math.max(x.start,g.start),w=Math.min(u.count,Math.min(x.start+x.count,g.start+g.count));for(let T=E,O=w;T<O;T+=3){const P=T,L=T+1,z=T+2;i=Sc(this,_,e,n,h,d,p,P,L,z),i&&(i.faceIndex=Math.floor(T/3),i.face.materialIndex=x.materialIndex,t.push(i))}}else{const y=Math.max(0,g.start),M=Math.min(u.count,g.start+g.count);for(let x=y,_=M;x<_;x+=3){const E=x,w=x+1,T=x+2;i=Sc(this,l,e,n,h,d,p,E,w,T),i&&(i.faceIndex=Math.floor(x/3),t.push(i))}}}}function bM(r,e,t,n,i,s,l,c){let u;if(e.side===Bn?u=n.intersectTriangle(l,s,i,!0,c):u=n.intersectTriangle(i,s,l,e.side===fr,c),u===null)return null;xc.copy(c),xc.applyMatrix4(r.matrixWorld);const h=t.ray.origin.distanceTo(xc);return h<t.near||h>t.far?null:{distance:h,point:xc.clone(),object:r}}function Sc(r,e,t,n,i,s,l,c,u,h){r.getVertexPosition(c,gc),r.getVertexPosition(u,vc),r.getVertexPosition(h,_c);const d=bM(r,e,t,n,gc,vc,_c,Zg);if(d){const p=new D;Xn.getBarycoord(Zg,gc,vc,_c,p),i&&(d.uv=Xn.getInterpolatedAttribute(i,c,u,h,p,new fe)),s&&(d.uv1=Xn.getInterpolatedAttribute(s,c,u,h,p,new fe)),l&&(d.normal=Xn.getInterpolatedAttribute(l,c,u,h,p,new D),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const m={a:c,b:u,c:h,normal:new D,materialIndex:0};Xn.getNormal(gc,vc,_c,m.normal),d.face=m,d.barycoord=p}return d}class Cs extends gt{constructor(e=1,t=1,n=1,i=1,s=1,l=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:l};const c=this;i=Math.floor(i),s=Math.floor(s),l=Math.floor(l);const u=[],h=[],d=[],p=[];let m=0,g=0;y("z","y","x",-1,-1,n,t,e,l,s,0),y("z","y","x",1,-1,n,t,-e,l,s,1),y("x","z","y",1,1,e,n,t,i,l,2),y("x","z","y",1,-1,e,n,-t,i,l,3),y("x","y","z",1,-1,e,t,n,i,s,4),y("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(u),this.setAttribute("position",new Xe(h,3)),this.setAttribute("normal",new Xe(d,3)),this.setAttribute("uv",new Xe(p,2));function y(M,x,_,E,w,T,O,P,L,z,X){const b=T/L,C=O/z,G=T/2,q=O/2,Q=P/2,ae=L+1,K=z+1;let me=0,F=0;const J=new D;for(let Z=0;Z<K;Z++){const ie=Z*C-q;for(let xe=0;xe<ae;xe++){const ze=xe*b-G;J[M]=ze*E,J[x]=ie*w,J[_]=Q,h.push(J.x,J.y,J.z),J[M]=0,J[x]=0,J[_]=P>0?1:-1,d.push(J.x,J.y,J.z),p.push(xe/L),p.push(1-Z/z),me+=1}}for(let Z=0;Z<z;Z++)for(let ie=0;ie<L;ie++){const xe=m+ie+ae*Z,ze=m+ie+ae*(Z+1),ne=m+(ie+1)+ae*(Z+1),de=m+(ie+1)+ae*Z;u.push(xe,ze,de),u.push(ze,ne,de),F+=6}c.addGroup(g,F,X),g+=F,m+=me}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Cs(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function To(r){const e={};for(const t in r){e[t]={};for(const n in r[t]){const i=r[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function On(r){const e={};for(let t=0;t<r.length;t++){const n=To(r[t]);for(const i in n)e[i]=n[i]}return e}function CM(r){const e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function L_(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Lt.workingColorSpace}const Vu={clone:To,merge:On};var RM=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,PM=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class gi extends Pn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=RM,this.fragmentShader=PM,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=To(e.uniforms),this.uniformsGroups=CM(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const l=this.uniforms[i].value;l&&l.isTexture?t.uniforms[i]={type:"t",value:l.toJSON(e).uuid}:l&&l.isColor?t.uniforms[i]={type:"c",value:l.getHex()}:l&&l.isVector2?t.uniforms[i]={type:"v2",value:l.toArray()}:l&&l.isVector3?t.uniforms[i]={type:"v3",value:l.toArray()}:l&&l.isVector4?t.uniforms[i]={type:"v4",value:l.toArray()}:l&&l.isMatrix3?t.uniforms[i]={type:"m3",value:l.toArray()}:l&&l.isMatrix4?t.uniforms[i]={type:"m4",value:l.toArray()}:t.uniforms[i]={value:l}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class ja extends bt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new et,this.projectionMatrix=new et,this.projectionMatrixInverse=new et,this.coordinateSystem=Vi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Lr=new D,Jg=new fe,Kg=new fe;class fn extends ja{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ao*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(xs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ao*2*Math.atan(Math.tan(xs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Lr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Lr.x,Lr.y).multiplyScalar(-e/Lr.z),Lr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Lr.x,Lr.y).multiplyScalar(-e/Lr.z)}getViewSize(e,t){return this.getViewBounds(e,Jg,Kg),t.subVectors(Kg,Jg)}setViewOffset(e,t,n,i,s,l){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=l,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(xs*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i;const l=this.view;if(this.view!==null&&this.view.enabled){const u=l.fullWidth,h=l.fullHeight;s+=l.offsetX*i/u,t-=l.offsetY*n/h,i*=l.width/u,n*=l.height/h}const c=this.filmOffset;c!==0&&(s+=e*c/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ro=-90,so=1;class D_ extends bt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new fn(ro,so,e,t);i.layers=this.layers,this.add(i);const s=new fn(ro,so,e,t);s.layers=this.layers,this.add(s);const l=new fn(ro,so,e,t);l.layers=this.layers,this.add(l);const c=new fn(ro,so,e,t);c.layers=this.layers,this.add(c);const u=new fn(ro,so,e,t);u.layers=this.layers,this.add(u);const h=new fn(ro,so,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,s,l,c,u]=t;for(const h of t)this.remove(h);if(e===Vi)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),l.up.set(0,0,1),l.lookAt(0,-1,0),c.up.set(0,1,0),c.lookAt(0,0,1),u.up.set(0,1,0),u.lookAt(0,0,-1);else if(e===Fa)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),l.up.set(0,0,-1),l.lookAt(0,-1,0),c.up.set(0,-1,0),c.lookAt(0,0,1),u.up.set(0,-1,0),u.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,l,c,u,h,d]=this.children,p=e.getRenderTarget(),m=e.getActiveCubeFace(),g=e.getActiveMipmapLevel(),y=e.xr.enabled;e.xr.enabled=!1;const M=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,s),e.setRenderTarget(n,1,i),e.render(t,l),e.setRenderTarget(n,2,i),e.render(t,c),e.setRenderTarget(n,3,i),e.render(t,u),e.setRenderTarget(n,4,i),e.render(t,h),n.texture.generateMipmaps=M,e.setRenderTarget(n,5,i),e.render(t,d),e.setRenderTarget(p,m,g),e.xr.enabled=y,n.texture.needsPMREMUpdate=!0}}class Qa extends Jt{constructor(e,t,n,i,s,l,c,u,h,d){e=e!==void 0?e:[],t=t!==void 0?t:dr,super(e,t,n,i,s,l,c,u,h,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class U_ extends Ti{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Qa(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:nn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Cs(5,5,5),s=new gi({name:"CubemapFromEquirect",uniforms:To(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Bn,blending:hr});s.uniforms.tEquirect.value=t;const l=new Qt(i,s),c=t.minFilter;return t.minFilter===Hi&&(t.minFilter=nn),new D_(1,10,this).update(e,l),t.minFilter=c,l.geometry.dispose(),l.material.dispose(),this}clear(e,t,n,i){const s=e.getRenderTarget();for(let l=0;l<6;l++)e.setRenderTarget(this,l),e.clear(t,n,i);e.setRenderTarget(s)}}const id=new D,IM=new D,LM=new ft;class Nr{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=id.subVectors(n,t).cross(IM.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(id),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||LM.getNormalMatrix(e),i=this.coplanarPoint(id).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ts=new mn,Mc=new D;class $a{constructor(e=new Nr,t=new Nr,n=new Nr,i=new Nr,s=new Nr,l=new Nr){this.planes=[e,t,n,i,s,l]}set(e,t,n,i,s,l){const c=this.planes;return c[0].copy(e),c[1].copy(t),c[2].copy(n),c[3].copy(i),c[4].copy(s),c[5].copy(l),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Vi){const n=this.planes,i=e.elements,s=i[0],l=i[1],c=i[2],u=i[3],h=i[4],d=i[5],p=i[6],m=i[7],g=i[8],y=i[9],M=i[10],x=i[11],_=i[12],E=i[13],w=i[14],T=i[15];if(n[0].setComponents(u-s,m-h,x-g,T-_).normalize(),n[1].setComponents(u+s,m+h,x+g,T+_).normalize(),n[2].setComponents(u+l,m+d,x+y,T+E).normalize(),n[3].setComponents(u-l,m-d,x-y,T-E).normalize(),n[4].setComponents(u-c,m-p,x-M,T-w).normalize(),t===Vi)n[5].setComponents(u+c,m+p,x+M,T+w).normalize();else if(t===Fa)n[5].setComponents(c,p,M,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ts.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ts.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ts)}intersectsSprite(e){return ts.center.set(0,0,0),ts.radius=.7071067811865476,ts.applyMatrix4(e.matrixWorld),this.intersectsSphere(ts)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Mc.x=i.normal.x>0?e.max.x:e.min.x,Mc.y=i.normal.y>0?e.max.y:e.min.y,Mc.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Mc)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function N_(){let r=null,e=!1,t=null,n=null;function i(s,l){t(s,l),n=r.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function DM(r){const e=new WeakMap;function t(c,u){const h=c.array,d=c.usage,p=h.byteLength,m=r.createBuffer();r.bindBuffer(u,m),r.bufferData(u,h,d),c.onUploadCallback();let g;if(h instanceof Float32Array)g=r.FLOAT;else if(h instanceof Uint16Array)c.isFloat16BufferAttribute?g=r.HALF_FLOAT:g=r.UNSIGNED_SHORT;else if(h instanceof Int16Array)g=r.SHORT;else if(h instanceof Uint32Array)g=r.UNSIGNED_INT;else if(h instanceof Int32Array)g=r.INT;else if(h instanceof Int8Array)g=r.BYTE;else if(h instanceof Uint8Array)g=r.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)g=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:m,type:g,bytesPerElement:h.BYTES_PER_ELEMENT,version:c.version,size:p}}function n(c,u,h){const d=u.array,p=u.updateRanges;if(r.bindBuffer(h,c),p.length===0)r.bufferSubData(h,0,d);else{p.sort((g,y)=>g.start-y.start);let m=0;for(let g=1;g<p.length;g++){const y=p[m],M=p[g];M.start<=y.start+y.count+1?y.count=Math.max(y.count,M.start+M.count-y.start):(++m,p[m]=M)}p.length=m+1;for(let g=0,y=p.length;g<y;g++){const M=p[g];r.bufferSubData(h,M.start*d.BYTES_PER_ELEMENT,d,M.start,M.count)}u.clearUpdateRanges()}u.onUploadCallback()}function i(c){return c.isInterleavedBufferAttribute&&(c=c.data),e.get(c)}function s(c){c.isInterleavedBufferAttribute&&(c=c.data);const u=e.get(c);u&&(r.deleteBuffer(u.buffer),e.delete(c))}function l(c,u){if(c.isInterleavedBufferAttribute&&(c=c.data),c.isGLBufferAttribute){const d=e.get(c);(!d||d.version<c.version)&&e.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}const h=e.get(c);if(h===void 0)e.set(c,t(c,u));else if(h.version<c.version){if(h.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(h.buffer,c,u),h.version=c.version}}return{get:i,remove:s,update:l}}class Rs extends gt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const s=e/2,l=t/2,c=Math.floor(n),u=Math.floor(i),h=c+1,d=u+1,p=e/c,m=t/u,g=[],y=[],M=[],x=[];for(let _=0;_<d;_++){const E=_*m-l;for(let w=0;w<h;w++){const T=w*p-s;y.push(T,-E,0),M.push(0,0,1),x.push(w/c),x.push(1-_/u)}}for(let _=0;_<u;_++)for(let E=0;E<c;E++){const w=E+h*_,T=E+h*(_+1),O=E+1+h*(_+1),P=E+1+h*_;g.push(w,T,P),g.push(T,O,P)}this.setIndex(g),this.setAttribute("position",new Xe(y,3)),this.setAttribute("normal",new Xe(M,3)),this.setAttribute("uv",new Xe(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Rs(e.width,e.height,e.widthSegments,e.heightSegments)}}var UM=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,NM=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,OM=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,FM=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,BM=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,zM=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,kM=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,HM=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,VM=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,GM=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,WM=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,XM=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,YM=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,qM=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ZM=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,JM=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,KM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,jM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,QM=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$M=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ew=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,tw=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,nw=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,iw=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,rw=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,sw=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,ow=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,aw=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,lw=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,cw=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,uw="gl_FragColor = linearToOutputTexel( gl_FragColor );",hw=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,fw=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,dw=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,pw=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,mw=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,gw=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,vw=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,_w=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,yw=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,xw=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Sw=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Mw=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ww=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ew=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Aw=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Tw=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,bw=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Cw=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Rw=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Pw=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Iw=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Lw=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Dw=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Uw=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Nw=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ow=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Fw=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Bw=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,zw=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,kw=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Hw=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Vw=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Gw=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ww=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Xw=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Yw=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,qw=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Zw=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jw=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Kw=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,jw=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Qw=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,$w=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,e1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,t1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,n1=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,i1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,r1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,s1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,o1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,a1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,l1=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,c1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,u1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,h1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,f1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,d1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,p1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,m1=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,g1=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,v1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,_1=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,y1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,x1=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,S1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,M1=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,w1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,E1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,A1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,T1=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,b1=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,C1=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,R1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,P1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,I1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,L1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const D1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,U1=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,N1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,O1=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,F1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,B1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,z1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,k1=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,H1=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,V1=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,G1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,W1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,X1=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Y1=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,q1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Z1=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,J1=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,K1=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,j1=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Q1=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$1=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,eE=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,tE=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,nE=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,iE=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,rE=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sE=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,oE=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,aE=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,lE=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,cE=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,uE=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,hE=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,fE=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,pt={alphahash_fragment:UM,alphahash_pars_fragment:NM,alphamap_fragment:OM,alphamap_pars_fragment:FM,alphatest_fragment:BM,alphatest_pars_fragment:zM,aomap_fragment:kM,aomap_pars_fragment:HM,batching_pars_vertex:VM,batching_vertex:GM,begin_vertex:WM,beginnormal_vertex:XM,bsdfs:YM,iridescence_fragment:qM,bumpmap_pars_fragment:ZM,clipping_planes_fragment:JM,clipping_planes_pars_fragment:KM,clipping_planes_pars_vertex:jM,clipping_planes_vertex:QM,color_fragment:$M,color_pars_fragment:ew,color_pars_vertex:tw,color_vertex:nw,common:iw,cube_uv_reflection_fragment:rw,defaultnormal_vertex:sw,displacementmap_pars_vertex:ow,displacementmap_vertex:aw,emissivemap_fragment:lw,emissivemap_pars_fragment:cw,colorspace_fragment:uw,colorspace_pars_fragment:hw,envmap_fragment:fw,envmap_common_pars_fragment:dw,envmap_pars_fragment:pw,envmap_pars_vertex:mw,envmap_physical_pars_fragment:Tw,envmap_vertex:gw,fog_vertex:vw,fog_pars_vertex:_w,fog_fragment:yw,fog_pars_fragment:xw,gradientmap_pars_fragment:Sw,lightmap_pars_fragment:Mw,lights_lambert_fragment:ww,lights_lambert_pars_fragment:Ew,lights_pars_begin:Aw,lights_toon_fragment:bw,lights_toon_pars_fragment:Cw,lights_phong_fragment:Rw,lights_phong_pars_fragment:Pw,lights_physical_fragment:Iw,lights_physical_pars_fragment:Lw,lights_fragment_begin:Dw,lights_fragment_maps:Uw,lights_fragment_end:Nw,logdepthbuf_fragment:Ow,logdepthbuf_pars_fragment:Fw,logdepthbuf_pars_vertex:Bw,logdepthbuf_vertex:zw,map_fragment:kw,map_pars_fragment:Hw,map_particle_fragment:Vw,map_particle_pars_fragment:Gw,metalnessmap_fragment:Ww,metalnessmap_pars_fragment:Xw,morphinstance_vertex:Yw,morphcolor_vertex:qw,morphnormal_vertex:Zw,morphtarget_pars_vertex:Jw,morphtarget_vertex:Kw,normal_fragment_begin:jw,normal_fragment_maps:Qw,normal_pars_fragment:$w,normal_pars_vertex:e1,normal_vertex:t1,normalmap_pars_fragment:n1,clearcoat_normal_fragment_begin:i1,clearcoat_normal_fragment_maps:r1,clearcoat_pars_fragment:s1,iridescence_pars_fragment:o1,opaque_fragment:a1,packing:l1,premultiplied_alpha_fragment:c1,project_vertex:u1,dithering_fragment:h1,dithering_pars_fragment:f1,roughnessmap_fragment:d1,roughnessmap_pars_fragment:p1,shadowmap_pars_fragment:m1,shadowmap_pars_vertex:g1,shadowmap_vertex:v1,shadowmask_pars_fragment:_1,skinbase_vertex:y1,skinning_pars_vertex:x1,skinning_vertex:S1,skinnormal_vertex:M1,specularmap_fragment:w1,specularmap_pars_fragment:E1,tonemapping_fragment:A1,tonemapping_pars_fragment:T1,transmission_fragment:b1,transmission_pars_fragment:C1,uv_pars_fragment:R1,uv_pars_vertex:P1,uv_vertex:I1,worldpos_vertex:L1,background_vert:D1,background_frag:U1,backgroundCube_vert:N1,backgroundCube_frag:O1,cube_vert:F1,cube_frag:B1,depth_vert:z1,depth_frag:k1,distanceRGBA_vert:H1,distanceRGBA_frag:V1,equirect_vert:G1,equirect_frag:W1,linedashed_vert:X1,linedashed_frag:Y1,meshbasic_vert:q1,meshbasic_frag:Z1,meshlambert_vert:J1,meshlambert_frag:K1,meshmatcap_vert:j1,meshmatcap_frag:Q1,meshnormal_vert:$1,meshnormal_frag:eE,meshphong_vert:tE,meshphong_frag:nE,meshphysical_vert:iE,meshphysical_frag:rE,meshtoon_vert:sE,meshtoon_frag:oE,points_vert:aE,points_frag:lE,shadow_vert:cE,shadow_frag:uE,sprite_vert:hE,sprite_frag:fE},be={common:{diffuse:{value:new Ie(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ft},alphaMap:{value:null},alphaMapTransform:{value:new ft},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ft}},envmap:{envMap:{value:null},envMapRotation:{value:new ft},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ft}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ft}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ft},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ft},normalScale:{value:new fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ft},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ft}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ft}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ft}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ie(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ie(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ft},alphaTest:{value:0},uvTransform:{value:new ft}},sprite:{diffuse:{value:new Ie(16777215)},opacity:{value:1},center:{value:new fe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ft},alphaMap:{value:null},alphaMapTransform:{value:new ft},alphaTest:{value:0}}},Ei={basic:{uniforms:On([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.fog]),vertexShader:pt.meshbasic_vert,fragmentShader:pt.meshbasic_frag},lambert:{uniforms:On([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new Ie(0)}}]),vertexShader:pt.meshlambert_vert,fragmentShader:pt.meshlambert_frag},phong:{uniforms:On([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new Ie(0)},specular:{value:new Ie(1118481)},shininess:{value:30}}]),vertexShader:pt.meshphong_vert,fragmentShader:pt.meshphong_frag},standard:{uniforms:On([be.common,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.roughnessmap,be.metalnessmap,be.fog,be.lights,{emissive:{value:new Ie(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:pt.meshphysical_vert,fragmentShader:pt.meshphysical_frag},toon:{uniforms:On([be.common,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.gradientmap,be.fog,be.lights,{emissive:{value:new Ie(0)}}]),vertexShader:pt.meshtoon_vert,fragmentShader:pt.meshtoon_frag},matcap:{uniforms:On([be.common,be.bumpmap,be.normalmap,be.displacementmap,be.fog,{matcap:{value:null}}]),vertexShader:pt.meshmatcap_vert,fragmentShader:pt.meshmatcap_frag},points:{uniforms:On([be.points,be.fog]),vertexShader:pt.points_vert,fragmentShader:pt.points_frag},dashed:{uniforms:On([be.common,be.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:pt.linedashed_vert,fragmentShader:pt.linedashed_frag},depth:{uniforms:On([be.common,be.displacementmap]),vertexShader:pt.depth_vert,fragmentShader:pt.depth_frag},normal:{uniforms:On([be.common,be.bumpmap,be.normalmap,be.displacementmap,{opacity:{value:1}}]),vertexShader:pt.meshnormal_vert,fragmentShader:pt.meshnormal_frag},sprite:{uniforms:On([be.sprite,be.fog]),vertexShader:pt.sprite_vert,fragmentShader:pt.sprite_frag},background:{uniforms:{uvTransform:{value:new ft},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:pt.background_vert,fragmentShader:pt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ft}},vertexShader:pt.backgroundCube_vert,fragmentShader:pt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:pt.cube_vert,fragmentShader:pt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:pt.equirect_vert,fragmentShader:pt.equirect_frag},distanceRGBA:{uniforms:On([be.common,be.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:pt.distanceRGBA_vert,fragmentShader:pt.distanceRGBA_frag},shadow:{uniforms:On([be.lights,be.fog,{color:{value:new Ie(0)},opacity:{value:1}}]),vertexShader:pt.shadow_vert,fragmentShader:pt.shadow_frag}};Ei.physical={uniforms:On([Ei.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ft},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ft},clearcoatNormalScale:{value:new fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ft},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ft},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ft},sheen:{value:0},sheenColor:{value:new Ie(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ft},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ft},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ft},transmissionSamplerSize:{value:new fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ft},attenuationDistance:{value:0},attenuationColor:{value:new Ie(0)},specularColor:{value:new Ie(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ft},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ft},anisotropyVector:{value:new fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ft}}]),vertexShader:pt.meshphysical_vert,fragmentShader:pt.meshphysical_frag};const wc={r:0,b:0,g:0},ns=new ri,dE=new et;function pE(r,e,t,n,i,s,l){const c=new Ie(0);let u=s===!0?0:1,h,d,p=null,m=0,g=null;function y(E){let w=E.isScene===!0?E.background:null;return w&&w.isTexture&&(w=(E.backgroundBlurriness>0?t:e).get(w)),w}function M(E){let w=!1;const T=y(E);T===null?_(c,u):T&&T.isColor&&(_(T,1),w=!0);const O=r.xr.getEnvironmentBlendMode();O==="additive"?n.buffers.color.setClear(0,0,0,1,l):O==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,l),(r.autoClear||w)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function x(E,w){const T=y(w);T&&(T.isCubeTexture||T.mapping===Ro)?(d===void 0&&(d=new Qt(new Cs(1,1,1),new gi({name:"BackgroundCubeMaterial",uniforms:To(Ei.backgroundCube.uniforms),vertexShader:Ei.backgroundCube.vertexShader,fragmentShader:Ei.backgroundCube.fragmentShader,side:Bn,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(O,P,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(d)),ns.copy(w.backgroundRotation),ns.x*=-1,ns.y*=-1,ns.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(ns.y*=-1,ns.z*=-1),d.material.uniforms.envMap.value=T,d.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(dE.makeRotationFromEuler(ns)),d.material.toneMapped=Lt.getTransfer(T.colorSpace)!==zt,(p!==T||m!==T.version||g!==r.toneMapping)&&(d.material.needsUpdate=!0,p=T,m=T.version,g=r.toneMapping),d.layers.enableAll(),E.unshift(d,d.geometry,d.material,0,0,null)):T&&T.isTexture&&(h===void 0&&(h=new Qt(new Rs(2,2),new gi({name:"BackgroundMaterial",uniforms:To(Ei.background.uniforms),vertexShader:Ei.background.vertexShader,fragmentShader:Ei.background.fragmentShader,side:fr,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(h)),h.material.uniforms.t2D.value=T,h.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,h.material.toneMapped=Lt.getTransfer(T.colorSpace)!==zt,T.matrixAutoUpdate===!0&&T.updateMatrix(),h.material.uniforms.uvTransform.value.copy(T.matrix),(p!==T||m!==T.version||g!==r.toneMapping)&&(h.material.needsUpdate=!0,p=T,m=T.version,g=r.toneMapping),h.layers.enableAll(),E.unshift(h,h.geometry,h.material,0,0,null))}function _(E,w){E.getRGB(wc,L_(r)),n.buffers.color.setClear(wc.r,wc.g,wc.b,w,l)}return{getClearColor:function(){return c},setClearColor:function(E,w=1){c.set(E),u=w,_(c,u)},getClearAlpha:function(){return u},setClearAlpha:function(E){u=E,_(c,u)},render:M,addToRenderList:x}}function mE(r,e){const t=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=m(null);let s=i,l=!1;function c(b,C,G,q,Q){let ae=!1;const K=p(q,G,C);s!==K&&(s=K,h(s.object)),ae=g(b,q,G,Q),ae&&y(b,q,G,Q),Q!==null&&e.update(Q,r.ELEMENT_ARRAY_BUFFER),(ae||l)&&(l=!1,T(b,C,G,q),Q!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(Q).buffer))}function u(){return r.createVertexArray()}function h(b){return r.bindVertexArray(b)}function d(b){return r.deleteVertexArray(b)}function p(b,C,G){const q=G.wireframe===!0;let Q=n[b.id];Q===void 0&&(Q={},n[b.id]=Q);let ae=Q[C.id];ae===void 0&&(ae={},Q[C.id]=ae);let K=ae[q];return K===void 0&&(K=m(u()),ae[q]=K),K}function m(b){const C=[],G=[],q=[];for(let Q=0;Q<t;Q++)C[Q]=0,G[Q]=0,q[Q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:G,attributeDivisors:q,object:b,attributes:{},index:null}}function g(b,C,G,q){const Q=s.attributes,ae=C.attributes;let K=0;const me=G.getAttributes();for(const F in me)if(me[F].location>=0){const Z=Q[F];let ie=ae[F];if(ie===void 0&&(F==="instanceMatrix"&&b.instanceMatrix&&(ie=b.instanceMatrix),F==="instanceColor"&&b.instanceColor&&(ie=b.instanceColor)),Z===void 0||Z.attribute!==ie||ie&&Z.data!==ie.data)return!0;K++}return s.attributesNum!==K||s.index!==q}function y(b,C,G,q){const Q={},ae=C.attributes;let K=0;const me=G.getAttributes();for(const F in me)if(me[F].location>=0){let Z=ae[F];Z===void 0&&(F==="instanceMatrix"&&b.instanceMatrix&&(Z=b.instanceMatrix),F==="instanceColor"&&b.instanceColor&&(Z=b.instanceColor));const ie={};ie.attribute=Z,Z&&Z.data&&(ie.data=Z.data),Q[F]=ie,K++}s.attributes=Q,s.attributesNum=K,s.index=q}function M(){const b=s.newAttributes;for(let C=0,G=b.length;C<G;C++)b[C]=0}function x(b){_(b,0)}function _(b,C){const G=s.newAttributes,q=s.enabledAttributes,Q=s.attributeDivisors;G[b]=1,q[b]===0&&(r.enableVertexAttribArray(b),q[b]=1),Q[b]!==C&&(r.vertexAttribDivisor(b,C),Q[b]=C)}function E(){const b=s.newAttributes,C=s.enabledAttributes;for(let G=0,q=C.length;G<q;G++)C[G]!==b[G]&&(r.disableVertexAttribArray(G),C[G]=0)}function w(b,C,G,q,Q,ae,K){K===!0?r.vertexAttribIPointer(b,C,G,Q,ae):r.vertexAttribPointer(b,C,G,q,Q,ae)}function T(b,C,G,q){M();const Q=q.attributes,ae=G.getAttributes(),K=C.defaultAttributeValues;for(const me in ae){const F=ae[me];if(F.location>=0){let J=Q[me];if(J===void 0&&(me==="instanceMatrix"&&b.instanceMatrix&&(J=b.instanceMatrix),me==="instanceColor"&&b.instanceColor&&(J=b.instanceColor)),J!==void 0){const Z=J.normalized,ie=J.itemSize,xe=e.get(J);if(xe===void 0)continue;const ze=xe.buffer,ne=xe.type,de=xe.bytesPerElement,Me=ne===r.INT||ne===r.UNSIGNED_INT||J.gpuType===ju;if(J.isInterleavedBufferAttribute){const ye=J.data,rt=ye.stride,Qe=J.offset;if(ye.isInstancedInterleavedBuffer){for(let st=0;st<F.locationSize;st++)_(F.location+st,ye.meshPerAttribute);b.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=ye.meshPerAttribute*ye.count)}else for(let st=0;st<F.locationSize;st++)x(F.location+st);r.bindBuffer(r.ARRAY_BUFFER,ze);for(let st=0;st<F.locationSize;st++)w(F.location+st,ie/F.locationSize,ne,Z,rt*de,(Qe+ie/F.locationSize*st)*de,Me)}else{if(J.isInstancedBufferAttribute){for(let ye=0;ye<F.locationSize;ye++)_(F.location+ye,J.meshPerAttribute);b.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let ye=0;ye<F.locationSize;ye++)x(F.location+ye);r.bindBuffer(r.ARRAY_BUFFER,ze);for(let ye=0;ye<F.locationSize;ye++)w(F.location+ye,ie/F.locationSize,ne,Z,ie*de,ie/F.locationSize*ye*de,Me)}}else if(K!==void 0){const Z=K[me];if(Z!==void 0)switch(Z.length){case 2:r.vertexAttrib2fv(F.location,Z);break;case 3:r.vertexAttrib3fv(F.location,Z);break;case 4:r.vertexAttrib4fv(F.location,Z);break;default:r.vertexAttrib1fv(F.location,Z)}}}}E()}function O(){z();for(const b in n){const C=n[b];for(const G in C){const q=C[G];for(const Q in q)d(q[Q].object),delete q[Q];delete C[G]}delete n[b]}}function P(b){if(n[b.id]===void 0)return;const C=n[b.id];for(const G in C){const q=C[G];for(const Q in q)d(q[Q].object),delete q[Q];delete C[G]}delete n[b.id]}function L(b){for(const C in n){const G=n[C];if(G[b.id]===void 0)continue;const q=G[b.id];for(const Q in q)d(q[Q].object),delete q[Q];delete G[b.id]}}function z(){X(),l=!0,s!==i&&(s=i,h(s.object))}function X(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:c,reset:z,resetDefaultState:X,dispose:O,releaseStatesOfGeometry:P,releaseStatesOfProgram:L,initAttributes:M,enableAttribute:x,disableUnusedAttributes:E}}function gE(r,e,t){let n;function i(h){n=h}function s(h,d){r.drawArrays(n,h,d),t.update(d,n,1)}function l(h,d,p){p!==0&&(r.drawArraysInstanced(n,h,d,p),t.update(d,n,p))}function c(h,d,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,h,0,d,0,p);let g=0;for(let y=0;y<p;y++)g+=d[y];t.update(g,n,1)}function u(h,d,p,m){if(p===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let y=0;y<h.length;y++)l(h[y],d[y],m[y]);else{g.multiDrawArraysInstancedWEBGL(n,h,0,d,0,m,0,p);let y=0;for(let M=0;M<p;M++)y+=d[M];for(let M=0;M<m.length;M++)t.update(y,n,m[M])}}this.setMode=i,this.render=s,this.renderInstances=l,this.renderMultiDraw=c,this.renderMultiDrawInstances=u}function vE(r,e,t,n){let i;function s(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const L=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(L.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function l(L){return!(L!==Rn&&n.convert(L)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function c(L){const z=L===Po&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(L!==Ai&&n.convert(L)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&L!==Yn&&!z)}function u(L){if(L==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";L="mediump"}return L==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp";const d=u(h);d!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",d,"instead."),h=d);const p=t.logarithmicDepthBuffer===!0,m=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control");if(m===!0){const L=e.get("EXT_clip_control");L.clipControlEXT(L.LOWER_LEFT_EXT,L.ZERO_TO_ONE_EXT)}const g=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),y=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=r.getParameter(r.MAX_TEXTURE_SIZE),x=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),_=r.getParameter(r.MAX_VERTEX_ATTRIBS),E=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),w=r.getParameter(r.MAX_VARYING_VECTORS),T=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),O=y>0,P=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:u,textureFormatReadable:l,textureTypeReadable:c,precision:h,logarithmicDepthBuffer:p,reverseDepthBuffer:m,maxTextures:g,maxVertexTextures:y,maxTextureSize:M,maxCubemapSize:x,maxAttributes:_,maxVertexUniforms:E,maxVaryings:w,maxFragmentUniforms:T,vertexTextures:O,maxSamples:P}}function _E(r){const e=this;let t=null,n=0,i=!1,s=!1;const l=new Nr,c=new ft,u={value:null,needsUpdate:!1};this.uniform=u,this.numPlanes=0,this.numIntersection=0,this.init=function(p,m){const g=p.length!==0||m||n!==0||i;return i=m,n=p.length,g},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(p,m){t=d(p,m,0)},this.setState=function(p,m,g){const y=p.clippingPlanes,M=p.clipIntersection,x=p.clipShadows,_=r.get(p);if(!i||y===null||y.length===0||s&&!x)s?d(null):h();else{const E=s?0:n,w=E*4;let T=_.clippingState||null;u.value=T,T=d(y,m,w,g);for(let O=0;O!==w;++O)T[O]=t[O];_.clippingState=T,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=E}};function h(){u.value!==t&&(u.value=t,u.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(p,m,g,y){const M=p!==null?p.length:0;let x=null;if(M!==0){if(x=u.value,y!==!0||x===null){const _=g+M*4,E=m.matrixWorldInverse;c.getNormalMatrix(E),(x===null||x.length<_)&&(x=new Float32Array(_));for(let w=0,T=g;w!==M;++w,T+=4)l.copy(p[w]).applyMatrix4(E,c),l.normal.toArray(x,T),x[T+3]=l.constant}u.value=x,u.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,x}}function yE(r){let e=new WeakMap;function t(l,c){return c===ba?l.mapping=dr:c===Ca&&(l.mapping=Fr),l}function n(l){if(l&&l.isTexture){const c=l.mapping;if(c===ba||c===Ca)if(e.has(l)){const u=e.get(l).texture;return t(u,l.mapping)}else{const u=l.image;if(u&&u.height>0){const h=new U_(u.height);return h.fromEquirectangularTexture(r,l),e.set(l,h),l.addEventListener("dispose",i),t(h.texture,l.mapping)}else return null}}return l}function i(l){const c=l.target;c.removeEventListener("dispose",i);const u=e.get(c);u!==void 0&&(e.delete(c),u.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}class el extends ja{constructor(e=-1,t=1,n=1,i=-1,s=.1,l=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=l,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,l){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=l,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-e,l=n+e,c=i+t,u=i-t;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=h*this.view.offsetX,l=s+h*this.view.width,c-=d*this.view.offsetY,u=c-d*this.view.height}this.projectionMatrix.makeOrthographic(s,l,c,u,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const yo=4,jg=[.125,.215,.35,.446,.526,.582],ds=20,rd=new el,Qg=new Ie;let sd=null,od=0,ad=0,ld=!1;const hs=(1+Math.sqrt(5))/2,oo=1/hs,$g=[new D(-hs,oo,0),new D(hs,oo,0),new D(-oo,0,hs),new D(oo,0,hs),new D(0,hs,-oo),new D(0,hs,oo),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)];class Jd{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){sd=this._renderer.getRenderTarget(),od=this._renderer.getActiveCubeFace(),ad=this._renderer.getActiveMipmapLevel(),ld=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,i,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=n0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=t0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(sd,od,ad),this._renderer.xr.enabled=ld,e.scissorTest=!1,Ec(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===dr||e.mapping===Fr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),sd=this._renderer.getRenderTarget(),od=this._renderer.getActiveCubeFace(),ad=this._renderer.getActiveMipmapLevel(),ld=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:nn,minFilter:nn,generateMipmaps:!1,type:Po,format:Rn,colorSpace:gr,depthBuffer:!1},i=e0(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=e0(e,t,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=xE(s)),this._blurMaterial=SE(s,e,t)}return i}_compileMaterial(e){const t=new Qt(this._lodPlanes[0],e);this._renderer.compile(t,rd)}_sceneToCubeUV(e,t,n,i){const c=new fn(90,1,t,n),u=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,p=d.autoClear,m=d.toneMapping;d.getClearColor(Qg),d.toneMapping=Gi,d.autoClear=!1;const g=new kr({name:"PMREM.Background",side:Bn,depthWrite:!1,depthTest:!1}),y=new Qt(new Cs,g);let M=!1;const x=e.background;x?x.isColor&&(g.color.copy(x),e.background=null,M=!0):(g.color.copy(Qg),M=!0);for(let _=0;_<6;_++){const E=_%3;E===0?(c.up.set(0,u[_],0),c.lookAt(h[_],0,0)):E===1?(c.up.set(0,0,u[_]),c.lookAt(0,h[_],0)):(c.up.set(0,u[_],0),c.lookAt(0,0,h[_]));const w=this._cubeSize;Ec(i,E*w,_>2?w:0,w,w),d.setRenderTarget(i),M&&d.render(y,c),d.render(e,c)}y.geometry.dispose(),y.material.dispose(),d.toneMapping=m,d.autoClear=p,e.background=x}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===dr||e.mapping===Fr;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=n0()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=t0());const s=i?this._cubemapMaterial:this._equirectMaterial,l=new Qt(this._lodPlanes[0],s),c=s.uniforms;c.envMap.value=e;const u=this._cubeSize;Ec(t,0,0,3*u,2*u),n.setRenderTarget(t),n.render(l,rd)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let s=1;s<i;s++){const l=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),c=$g[(i-s-1)%$g.length];this._blur(e,s-1,s,l,c)}t.autoClear=n}_blur(e,t,n,i,s){const l=this._pingPongRenderTarget;this._halfBlur(e,l,t,n,i,"latitudinal",s),this._halfBlur(l,e,n,n,i,"longitudinal",s)}_halfBlur(e,t,n,i,s,l,c){const u=this._renderer,h=this._blurMaterial;l!=="latitudinal"&&l!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,p=new Qt(this._lodPlanes[i],h),m=h.uniforms,g=this._sizeLods[n]-1,y=isFinite(s)?Math.PI/(2*g):2*Math.PI/(2*ds-1),M=s/y,x=isFinite(s)?1+Math.floor(d*M):ds;x>ds&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${x} samples when the maximum is set to ${ds}`);const _=[];let E=0;for(let L=0;L<ds;++L){const z=L/M,X=Math.exp(-z*z/2);_.push(X),L===0?E+=X:L<x&&(E+=2*X)}for(let L=0;L<_.length;L++)_[L]=_[L]/E;m.envMap.value=e.texture,m.samples.value=x,m.weights.value=_,m.latitudinal.value=l==="latitudinal",c&&(m.poleAxis.value=c);const{_lodMax:w}=this;m.dTheta.value=y,m.mipInt.value=w-n;const T=this._sizeLods[i],O=3*T*(i>w-yo?i-w+yo:0),P=4*(this._cubeSize-T);Ec(t,O,P,3*T,2*T),u.setRenderTarget(t),u.render(p,rd)}}function xE(r){const e=[],t=[],n=[];let i=r;const s=r-yo+1+jg.length;for(let l=0;l<s;l++){const c=Math.pow(2,i);t.push(c);let u=1/c;l>r-yo?u=jg[l-r+yo-1]:l===0&&(u=0),n.push(u);const h=1/(c-2),d=-h,p=1+h,m=[d,d,p,d,p,p,d,d,p,p,d,p],g=6,y=6,M=3,x=2,_=1,E=new Float32Array(M*y*g),w=new Float32Array(x*y*g),T=new Float32Array(_*y*g);for(let P=0;P<g;P++){const L=P%3*2/3-1,z=P>2?0:-1,X=[L,z,0,L+2/3,z,0,L+2/3,z+1,0,L,z,0,L+2/3,z+1,0,L,z+1,0];E.set(X,M*y*P),w.set(m,x*y*P);const b=[P,P,P,P,P,P];T.set(b,_*y*P)}const O=new gt;O.setAttribute("position",new Nt(E,M)),O.setAttribute("uv",new Nt(w,x)),O.setAttribute("faceIndex",new Nt(T,_)),e.push(O),i>yo&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function e0(r,e,t){const n=new Ti(r,e,t);return n.texture.mapping=Ro,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ec(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function SE(r,e,t){const n=new Float32Array(ds),i=new D(0,1,0);return new gi({name:"SphericalGaussianBlur",defines:{n:ds,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:wp(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:hr,depthTest:!1,depthWrite:!1})}function t0(){return new gi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:wp(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:hr,depthTest:!1,depthWrite:!1})}function n0(){return new gi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:wp(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:hr,depthTest:!1,depthWrite:!1})}function wp(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function ME(r){let e=new WeakMap,t=null;function n(c){if(c&&c.isTexture){const u=c.mapping,h=u===ba||u===Ca,d=u===dr||u===Fr;if(h||d){let p=e.get(c);const m=p!==void 0?p.texture.pmremVersion:0;if(c.isRenderTargetTexture&&c.pmremVersion!==m)return t===null&&(t=new Jd(r)),p=h?t.fromEquirectangular(c,p):t.fromCubemap(c,p),p.texture.pmremVersion=c.pmremVersion,e.set(c,p),p.texture;if(p!==void 0)return p.texture;{const g=c.image;return h&&g&&g.height>0||d&&g&&i(g)?(t===null&&(t=new Jd(r)),p=h?t.fromEquirectangular(c):t.fromCubemap(c),p.texture.pmremVersion=c.pmremVersion,e.set(c,p),c.addEventListener("dispose",s),p.texture):null}}}return c}function i(c){let u=0;const h=6;for(let d=0;d<h;d++)c[d]!==void 0&&u++;return u===h}function s(c){const u=c.target;u.removeEventListener("dispose",s);const h=e.get(u);h!==void 0&&(e.delete(u),h.dispose())}function l(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:l}}function wE(r){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=r.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&iu("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function EE(r,e,t,n){const i={},s=new WeakMap;function l(p){const m=p.target;m.index!==null&&e.remove(m.index);for(const y in m.attributes)e.remove(m.attributes[y]);for(const y in m.morphAttributes){const M=m.morphAttributes[y];for(let x=0,_=M.length;x<_;x++)e.remove(M[x])}m.removeEventListener("dispose",l),delete i[m.id];const g=s.get(m);g&&(e.remove(g),s.delete(m)),n.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,t.memory.geometries--}function c(p,m){return i[m.id]===!0||(m.addEventListener("dispose",l),i[m.id]=!0,t.memory.geometries++),m}function u(p){const m=p.attributes;for(const y in m)e.update(m[y],r.ARRAY_BUFFER);const g=p.morphAttributes;for(const y in g){const M=g[y];for(let x=0,_=M.length;x<_;x++)e.update(M[x],r.ARRAY_BUFFER)}}function h(p){const m=[],g=p.index,y=p.attributes.position;let M=0;if(g!==null){const E=g.array;M=g.version;for(let w=0,T=E.length;w<T;w+=3){const O=E[w+0],P=E[w+1],L=E[w+2];m.push(O,P,P,L,L,O)}}else if(y!==void 0){const E=y.array;M=y.version;for(let w=0,T=E.length/3-1;w<T;w+=3){const O=w+0,P=w+1,L=w+2;m.push(O,P,P,L,L,O)}}else return;const x=new(b_(m)?Mp:Sp)(m,1);x.version=M;const _=s.get(p);_&&e.remove(_),s.set(p,x)}function d(p){const m=s.get(p);if(m){const g=p.index;g!==null&&m.version<g.version&&h(p)}else h(p);return s.get(p)}return{get:c,update:u,getWireframeAttribute:d}}function AE(r,e,t){let n;function i(m){n=m}let s,l;function c(m){s=m.type,l=m.bytesPerElement}function u(m,g){r.drawElements(n,g,s,m*l),t.update(g,n,1)}function h(m,g,y){y!==0&&(r.drawElementsInstanced(n,g,s,m*l,y),t.update(g,n,y))}function d(m,g,y){if(y===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,g,0,s,m,0,y);let x=0;for(let _=0;_<y;_++)x+=g[_];t.update(x,n,1)}function p(m,g,y,M){if(y===0)return;const x=e.get("WEBGL_multi_draw");if(x===null)for(let _=0;_<m.length;_++)h(m[_]/l,g[_],M[_]);else{x.multiDrawElementsInstancedWEBGL(n,g,0,s,m,0,M,0,y);let _=0;for(let E=0;E<y;E++)_+=g[E];for(let E=0;E<M.length;E++)t.update(_,n,M[E])}}this.setMode=i,this.setIndex=c,this.render=u,this.renderInstances=h,this.renderMultiDraw=d,this.renderMultiDrawInstances=p}function TE(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,l,c){switch(t.calls++,l){case r.TRIANGLES:t.triangles+=c*(s/3);break;case r.LINES:t.lines+=c*(s/2);break;case r.LINE_STRIP:t.lines+=c*(s-1);break;case r.LINE_LOOP:t.lines+=c*s;break;case r.POINTS:t.points+=c*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",l);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function bE(r,e,t){const n=new WeakMap,i=new yt;function s(l,c,u){const h=l.morphTargetInfluences,d=c.morphAttributes.position||c.morphAttributes.normal||c.morphAttributes.color,p=d!==void 0?d.length:0;let m=n.get(c);if(m===void 0||m.count!==p){let X=function(){L.dispose(),n.delete(c),c.removeEventListener("dispose",X)};m!==void 0&&m.texture.dispose();const g=c.morphAttributes.position!==void 0,y=c.morphAttributes.normal!==void 0,M=c.morphAttributes.color!==void 0,x=c.morphAttributes.position||[],_=c.morphAttributes.normal||[],E=c.morphAttributes.color||[];let w=0;g===!0&&(w=1),y===!0&&(w=2),M===!0&&(w=3);let T=c.attributes.position.count*w,O=1;T>e.maxTextureSize&&(O=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);const P=new Float32Array(T*O*4*p),L=new sh(P,T,O,p);L.type=Yn,L.needsUpdate=!0;const z=w*4;for(let b=0;b<p;b++){const C=x[b],G=_[b],q=E[b],Q=T*O*4*b;for(let ae=0;ae<C.count;ae++){const K=ae*z;g===!0&&(i.fromBufferAttribute(C,ae),P[Q+K+0]=i.x,P[Q+K+1]=i.y,P[Q+K+2]=i.z,P[Q+K+3]=0),y===!0&&(i.fromBufferAttribute(G,ae),P[Q+K+4]=i.x,P[Q+K+5]=i.y,P[Q+K+6]=i.z,P[Q+K+7]=0),M===!0&&(i.fromBufferAttribute(q,ae),P[Q+K+8]=i.x,P[Q+K+9]=i.y,P[Q+K+10]=i.z,P[Q+K+11]=q.itemSize===4?i.w:1)}}m={count:p,texture:L,size:new fe(T,O)},n.set(c,m),c.addEventListener("dispose",X)}if(l.isInstancedMesh===!0&&l.morphTexture!==null)u.getUniforms().setValue(r,"morphTexture",l.morphTexture,t);else{let g=0;for(let M=0;M<h.length;M++)g+=h[M];const y=c.morphTargetsRelative?1:1-g;u.getUniforms().setValue(r,"morphTargetBaseInfluence",y),u.getUniforms().setValue(r,"morphTargetInfluences",h)}u.getUniforms().setValue(r,"morphTargetsTexture",m.texture,t),u.getUniforms().setValue(r,"morphTargetsTextureSize",m.size)}return{update:s}}function CE(r,e,t,n){let i=new WeakMap;function s(u){const h=n.render.frame,d=u.geometry,p=e.get(u,d);if(i.get(p)!==h&&(e.update(p),i.set(p,h)),u.isInstancedMesh&&(u.hasEventListener("dispose",c)===!1&&u.addEventListener("dispose",c),i.get(u)!==h&&(t.update(u.instanceMatrix,r.ARRAY_BUFFER),u.instanceColor!==null&&t.update(u.instanceColor,r.ARRAY_BUFFER),i.set(u,h))),u.isSkinnedMesh){const m=u.skeleton;i.get(m)!==h&&(m.update(),i.set(m,h))}return p}function l(){i=new WeakMap}function c(u){const h=u.target;h.removeEventListener("dispose",c),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:s,dispose:l}}class Ep extends Jt{constructor(e,t,n,i,s,l,c,u,h,d=ys){if(d!==ys&&d!==Ts)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&d===ys&&(n=pr),n===void 0&&d===Ts&&(n=As),super(null,i,s,l,c,u,d,n,h),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=c!==void 0?c:dn,this.minFilter=u!==void 0?u:dn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const O_=new Jt,i0=new Ep(1,1),F_=new sh,B_=new xp,z_=new Qa,r0=[],s0=[],o0=new Float32Array(16),a0=new Float32Array(9),l0=new Float32Array(4);function Lo(r,e,t){const n=r[0];if(n<=0||n>0)return r;const i=e*t;let s=r0[i];if(s===void 0&&(s=new Float32Array(i),r0[i]=s),e!==0){n.toArray(s,0);for(let l=1,c=0;l!==e;++l)c+=t,r[l].toArray(s,c)}return s}function on(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function an(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function oh(r,e){let t=s0[e];t===void 0&&(t=new Int32Array(e),s0[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function RE(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function PE(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(on(t,e))return;r.uniform2fv(this.addr,e),an(t,e)}}function IE(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(on(t,e))return;r.uniform3fv(this.addr,e),an(t,e)}}function LE(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(on(t,e))return;r.uniform4fv(this.addr,e),an(t,e)}}function DE(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(on(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),an(t,e)}else{if(on(t,n))return;l0.set(n),r.uniformMatrix2fv(this.addr,!1,l0),an(t,n)}}function UE(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(on(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),an(t,e)}else{if(on(t,n))return;a0.set(n),r.uniformMatrix3fv(this.addr,!1,a0),an(t,n)}}function NE(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(on(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),an(t,e)}else{if(on(t,n))return;o0.set(n),r.uniformMatrix4fv(this.addr,!1,o0),an(t,n)}}function OE(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function FE(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(on(t,e))return;r.uniform2iv(this.addr,e),an(t,e)}}function BE(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(on(t,e))return;r.uniform3iv(this.addr,e),an(t,e)}}function zE(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(on(t,e))return;r.uniform4iv(this.addr,e),an(t,e)}}function kE(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function HE(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(on(t,e))return;r.uniform2uiv(this.addr,e),an(t,e)}}function VE(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(on(t,e))return;r.uniform3uiv(this.addr,e),an(t,e)}}function GE(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(on(t,e))return;r.uniform4uiv(this.addr,e),an(t,e)}}function WE(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(i0.compareFunction=_p,s=i0):s=O_,t.setTexture2D(e||s,i)}function XE(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||B_,i)}function YE(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||z_,i)}function qE(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||F_,i)}function ZE(r){switch(r){case 5126:return RE;case 35664:return PE;case 35665:return IE;case 35666:return LE;case 35674:return DE;case 35675:return UE;case 35676:return NE;case 5124:case 35670:return OE;case 35667:case 35671:return FE;case 35668:case 35672:return BE;case 35669:case 35673:return zE;case 5125:return kE;case 36294:return HE;case 36295:return VE;case 36296:return GE;case 35678:case 36198:case 36298:case 36306:case 35682:return WE;case 35679:case 36299:case 36307:return XE;case 35680:case 36300:case 36308:case 36293:return YE;case 36289:case 36303:case 36311:case 36292:return qE}}function JE(r,e){r.uniform1fv(this.addr,e)}function KE(r,e){const t=Lo(e,this.size,2);r.uniform2fv(this.addr,t)}function jE(r,e){const t=Lo(e,this.size,3);r.uniform3fv(this.addr,t)}function QE(r,e){const t=Lo(e,this.size,4);r.uniform4fv(this.addr,t)}function $E(r,e){const t=Lo(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function eA(r,e){const t=Lo(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function tA(r,e){const t=Lo(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function nA(r,e){r.uniform1iv(this.addr,e)}function iA(r,e){r.uniform2iv(this.addr,e)}function rA(r,e){r.uniform3iv(this.addr,e)}function sA(r,e){r.uniform4iv(this.addr,e)}function oA(r,e){r.uniform1uiv(this.addr,e)}function aA(r,e){r.uniform2uiv(this.addr,e)}function lA(r,e){r.uniform3uiv(this.addr,e)}function cA(r,e){r.uniform4uiv(this.addr,e)}function uA(r,e,t){const n=this.cache,i=e.length,s=oh(t,i);on(n,s)||(r.uniform1iv(this.addr,s),an(n,s));for(let l=0;l!==i;++l)t.setTexture2D(e[l]||O_,s[l])}function hA(r,e,t){const n=this.cache,i=e.length,s=oh(t,i);on(n,s)||(r.uniform1iv(this.addr,s),an(n,s));for(let l=0;l!==i;++l)t.setTexture3D(e[l]||B_,s[l])}function fA(r,e,t){const n=this.cache,i=e.length,s=oh(t,i);on(n,s)||(r.uniform1iv(this.addr,s),an(n,s));for(let l=0;l!==i;++l)t.setTextureCube(e[l]||z_,s[l])}function dA(r,e,t){const n=this.cache,i=e.length,s=oh(t,i);on(n,s)||(r.uniform1iv(this.addr,s),an(n,s));for(let l=0;l!==i;++l)t.setTexture2DArray(e[l]||F_,s[l])}function pA(r){switch(r){case 5126:return JE;case 35664:return KE;case 35665:return jE;case 35666:return QE;case 35674:return $E;case 35675:return eA;case 35676:return tA;case 5124:case 35670:return nA;case 35667:case 35671:return iA;case 35668:case 35672:return rA;case 35669:case 35673:return sA;case 5125:return oA;case 36294:return aA;case 36295:return lA;case 36296:return cA;case 35678:case 36198:case 36298:case 36306:case 35682:return uA;case 35679:case 36299:case 36307:return hA;case 35680:case 36300:case 36308:case 36293:return fA;case 36289:case 36303:case 36311:case 36292:return dA}}class mA{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=ZE(t.type)}}class gA{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=pA(t.type)}}class vA{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let s=0,l=i.length;s!==l;++s){const c=i[s];c.setValue(e,t[c.id],n)}}}const cd=/(\w+)(\])?(\[|\.)?/g;function c0(r,e){r.seq.push(e),r.map[e.id]=e}function _A(r,e,t){const n=r.name,i=n.length;for(cd.lastIndex=0;;){const s=cd.exec(n),l=cd.lastIndex;let c=s[1];const u=s[2]==="]",h=s[3];if(u&&(c=c|0),h===void 0||h==="["&&l+2===i){c0(t,h===void 0?new mA(c,r,e):new gA(c,r,e));break}else{let p=t.map[c];p===void 0&&(p=new vA(c),c0(t,p)),t=p}}}class ru{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const s=e.getActiveUniform(t,i),l=e.getUniformLocation(t,s.name);_A(s,l,this)}}setValue(e,t,n,i){const s=this.map[t];s!==void 0&&s.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,l=t.length;s!==l;++s){const c=t[s],u=n[c.id];u.needsUpdate!==!1&&c.setValue(e,u.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,s=e.length;i!==s;++i){const l=e[i];l.id in t&&n.push(l)}return n}}function u0(r,e,t){const n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}const yA=37297;let xA=0;function SA(r,e){const t=r.split(`
`),n=[],i=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let l=i;l<s;l++){const c=l+1;n.push(`${c===e?">":" "} ${c}: ${t[l]}`)}return n.join(`
`)}function MA(r){const e=Lt.getPrimaries(Lt.workingColorSpace),t=Lt.getPrimaries(r);let n;switch(e===t?n="":e===Na&&t===Ua?n="LinearDisplayP3ToLinearSRGB":e===Ua&&t===Na&&(n="LinearSRGBToLinearDisplayP3"),r){case gr:case Ka:return[n,"LinearTransferOETF"];case Wn:case rh:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",r),[n,"LinearTransferOETF"]}}function h0(r,e,t){const n=r.getShaderParameter(e,r.COMPILE_STATUS),i=r.getShaderInfoLog(e).trim();if(n&&i==="")return"";const s=/ERROR: 0:(\d+)/.exec(i);if(s){const l=parseInt(s[1]);return t.toUpperCase()+`

`+i+`

`+SA(r.getShaderSource(e),l)}else return i}function wA(r,e){const t=MA(e);return`vec4 ${r}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function EA(r,e){let t;switch(e){case o_:t="Linear";break;case a_:t="Reinhard";break;case l_:t="Cineon";break;case op:t="ACESFilmic";break;case u_:t="AgX";break;case h_:t="Neutral";break;case c_:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Ac=new D;function AA(){Lt.getLuminanceCoefficients(Ac);const r=Ac.x.toFixed(4),e=Ac.y.toFixed(4),t=Ac.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function TA(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ma).join(`
`)}function bA(r){const e=[];for(const t in r){const n=r[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function CA(r,e){const t={},n=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=r.getActiveAttrib(e,i),l=s.name;let c=1;s.type===r.FLOAT_MAT2&&(c=2),s.type===r.FLOAT_MAT3&&(c=3),s.type===r.FLOAT_MAT4&&(c=4),t[l]={type:s.type,location:r.getAttribLocation(e,l),locationSize:c}}return t}function ma(r){return r!==""}function f0(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function d0(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const RA=/^[ \t]*#include +<([\w\d./]+)>/gm;function Kd(r){return r.replace(RA,IA)}const PA=new Map;function IA(r,e){let t=pt[e];if(t===void 0){const n=PA.get(e);if(n!==void 0)t=pt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Kd(t)}const LA=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function p0(r){return r.replace(LA,DA)}function DA(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function m0(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function UA(r){let e="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===Ju?e="SHADOWMAP_TYPE_PCF":r.shadowMapType===va?e="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===wi&&(e="SHADOWMAP_TYPE_VSM"),e}function NA(r){let e="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case dr:case Fr:e="ENVMAP_TYPE_CUBE";break;case Ro:e="ENVMAP_TYPE_CUBE_UV";break}return e}function OA(r){let e="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case Fr:e="ENVMAP_MODE_REFRACTION";break}return e}function FA(r){let e="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case Za:e="ENVMAP_BLENDING_MULTIPLY";break;case r_:e="ENVMAP_BLENDING_MIX";break;case s_:e="ENVMAP_BLENDING_ADD";break}return e}function BA(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function zA(r,e,t,n){const i=r.getContext(),s=t.defines;let l=t.vertexShader,c=t.fragmentShader;const u=UA(t),h=NA(t),d=OA(t),p=FA(t),m=BA(t),g=TA(t),y=bA(s),M=i.createProgram();let x,_,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y].filter(ma).join(`
`),x.length>0&&(x+=`
`),_=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y].filter(ma).join(`
`),_.length>0&&(_+=`
`)):(x=[m0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+u:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ma).join(`
`),_=[m0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",t.envMap?"#define "+p:"",m?"#define CUBEUV_TEXEL_WIDTH "+m.texelWidth:"",m?"#define CUBEUV_TEXEL_HEIGHT "+m.texelHeight:"",m?"#define CUBEUV_MAX_MIP "+m.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+u:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Gi?"#define TONE_MAPPING":"",t.toneMapping!==Gi?pt.tonemapping_pars_fragment:"",t.toneMapping!==Gi?EA("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",pt.colorspace_pars_fragment,wA("linearToOutputTexel",t.outputColorSpace),AA(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ma).join(`
`)),l=Kd(l),l=f0(l,t),l=d0(l,t),c=Kd(c),c=f0(c,t),c=d0(c,t),l=p0(l),c=p0(c),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,x=[g,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,_=["#define varying in",t.glslVersion===Zd?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Zd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+_);const w=E+x+l,T=E+_+c,O=u0(i,i.VERTEX_SHADER,w),P=u0(i,i.FRAGMENT_SHADER,T);i.attachShader(M,O),i.attachShader(M,P),t.index0AttributeName!==void 0?i.bindAttribLocation(M,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(M,0,"position"),i.linkProgram(M);function L(C){if(r.debug.checkShaderErrors){const G=i.getProgramInfoLog(M).trim(),q=i.getShaderInfoLog(O).trim(),Q=i.getShaderInfoLog(P).trim();let ae=!0,K=!0;if(i.getProgramParameter(M,i.LINK_STATUS)===!1)if(ae=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,M,O,P);else{const me=h0(i,O,"vertex"),F=h0(i,P,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(M,i.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+G+`
`+me+`
`+F)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(q===""||Q==="")&&(K=!1);K&&(C.diagnostics={runnable:ae,programLog:G,vertexShader:{log:q,prefix:x},fragmentShader:{log:Q,prefix:_}})}i.deleteShader(O),i.deleteShader(P),z=new ru(i,M),X=CA(i,M)}let z;this.getUniforms=function(){return z===void 0&&L(this),z};let X;this.getAttributes=function(){return X===void 0&&L(this),X};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=i.getProgramParameter(M,yA)),b},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=xA++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=O,this.fragmentShader=P,this}let kA=0;class HA{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),s=this._getShaderStage(n),l=this._getShaderCacheForMaterial(e);return l.has(i)===!1&&(l.add(i),i.usedTimes++),l.has(s)===!1&&(l.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new VA(e),t.set(e,n)),n}}class VA{constructor(e){this.id=kA++,this.code=e,this.usedTimes=0}}function GA(r,e,t,n,i,s,l){const c=new Ss,u=new HA,h=new Set,d=[],p=i.logarithmicDepthBuffer,m=i.reverseDepthBuffer,g=i.vertexTextures;let y=i.precision;const M={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(b){return h.add(b),b===0?"uv":`uv${b}`}function _(b,C,G,q,Q){const ae=q.fog,K=Q.geometry,me=b.isMeshStandardMaterial?q.environment:null,F=(b.isMeshStandardMaterial?t:e).get(b.envMap||me),J=F&&F.mapping===Ro?F.image.height:null,Z=M[b.type];b.precision!==null&&(y=i.getMaxPrecision(b.precision),y!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",y,"instead."));const ie=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,xe=ie!==void 0?ie.length:0;let ze=0;K.morphAttributes.position!==void 0&&(ze=1),K.morphAttributes.normal!==void 0&&(ze=2),K.morphAttributes.color!==void 0&&(ze=3);let ne,de,Me,ye;if(Z){const gn=Ei[Z];ne=gn.vertexShader,de=gn.fragmentShader}else ne=b.vertexShader,de=b.fragmentShader,u.update(b),Me=u.getVertexShaderID(b),ye=u.getFragmentShaderID(b);const rt=r.getRenderTarget(),Qe=Q.isInstancedMesh===!0,st=Q.isBatchedMesh===!0,nt=!!b.map,he=!!b.matcap,N=!!F,Ae=!!b.aoMap,we=!!b.lightMap,ge=!!b.bumpMap,Te=!!b.normalMap,Je=!!b.displacementMap,Ue=!!b.emissiveMap,U=!!b.metalnessMap,R=!!b.roughnessMap,j=b.anisotropy>0,le=b.clearcoat>0,ue=b.dispersion>0,ce=b.iridescence>0,Ye=b.sheen>0,Ce=b.transmission>0,Fe=j&&!!b.anisotropyMap,xt=le&&!!b.clearcoatMap,ve=le&&!!b.clearcoatNormalMap,Be=le&&!!b.clearcoatRoughnessMap,ot=ce&&!!b.iridescenceMap,at=ce&&!!b.iridescenceThicknessMap,ke=Ye&&!!b.sheenColorMap,St=Ye&&!!b.sheenRoughnessMap,ct=!!b.specularMap,Ut=!!b.specularColorMap,H=!!b.specularIntensityMap,Ne=Ce&&!!b.transmissionMap,se=Ce&&!!b.thicknessMap,pe=!!b.gradientMap,Le=!!b.alphaMap,Oe=b.alphaTest>0,Mt=!!b.alphaHash,Gt=!!b.extensions;let Sn=Gi;b.toneMapped&&(rt===null||rt.isXRRenderTarget===!0)&&(Sn=r.toneMapping);const wt={shaderID:Z,shaderType:b.type,shaderName:b.name,vertexShader:ne,fragmentShader:de,defines:b.defines,customVertexShaderID:Me,customFragmentShaderID:ye,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:y,batching:st,batchingColor:st&&Q._colorsTexture!==null,instancing:Qe,instancingColor:Qe&&Q.instanceColor!==null,instancingMorph:Qe&&Q.morphTexture!==null,supportsVertexTextures:g,outputColorSpace:rt===null?r.outputColorSpace:rt.isXRRenderTarget===!0?rt.texture.colorSpace:gr,alphaToCoverage:!!b.alphaToCoverage,map:nt,matcap:he,envMap:N,envMapMode:N&&F.mapping,envMapCubeUVHeight:J,aoMap:Ae,lightMap:we,bumpMap:ge,normalMap:Te,displacementMap:g&&Je,emissiveMap:Ue,normalMapObjectSpace:Te&&b.normalMapType===__,normalMapTangentSpace:Te&&b.normalMapType===zr,metalnessMap:U,roughnessMap:R,anisotropy:j,anisotropyMap:Fe,clearcoat:le,clearcoatMap:xt,clearcoatNormalMap:ve,clearcoatRoughnessMap:Be,dispersion:ue,iridescence:ce,iridescenceMap:ot,iridescenceThicknessMap:at,sheen:Ye,sheenColorMap:ke,sheenRoughnessMap:St,specularMap:ct,specularColorMap:Ut,specularIntensityMap:H,transmission:Ce,transmissionMap:Ne,thicknessMap:se,gradientMap:pe,opaque:b.transparent===!1&&b.blending===_s&&b.alphaToCoverage===!1,alphaMap:Le,alphaTest:Oe,alphaHash:Mt,combine:b.combine,mapUv:nt&&x(b.map.channel),aoMapUv:Ae&&x(b.aoMap.channel),lightMapUv:we&&x(b.lightMap.channel),bumpMapUv:ge&&x(b.bumpMap.channel),normalMapUv:Te&&x(b.normalMap.channel),displacementMapUv:Je&&x(b.displacementMap.channel),emissiveMapUv:Ue&&x(b.emissiveMap.channel),metalnessMapUv:U&&x(b.metalnessMap.channel),roughnessMapUv:R&&x(b.roughnessMap.channel),anisotropyMapUv:Fe&&x(b.anisotropyMap.channel),clearcoatMapUv:xt&&x(b.clearcoatMap.channel),clearcoatNormalMapUv:ve&&x(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Be&&x(b.clearcoatRoughnessMap.channel),iridescenceMapUv:ot&&x(b.iridescenceMap.channel),iridescenceThicknessMapUv:at&&x(b.iridescenceThicknessMap.channel),sheenColorMapUv:ke&&x(b.sheenColorMap.channel),sheenRoughnessMapUv:St&&x(b.sheenRoughnessMap.channel),specularMapUv:ct&&x(b.specularMap.channel),specularColorMapUv:Ut&&x(b.specularColorMap.channel),specularIntensityMapUv:H&&x(b.specularIntensityMap.channel),transmissionMapUv:Ne&&x(b.transmissionMap.channel),thicknessMapUv:se&&x(b.thicknessMap.channel),alphaMapUv:Le&&x(b.alphaMap.channel),vertexTangents:!!K.attributes.tangent&&(Te||j),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,pointsUvs:Q.isPoints===!0&&!!K.attributes.uv&&(nt||Le),fog:!!ae,useFog:b.fog===!0,fogExp2:!!ae&&ae.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:p,reverseDepthBuffer:m,skinning:Q.isSkinnedMesh===!0,morphTargets:K.morphAttributes.position!==void 0,morphNormals:K.morphAttributes.normal!==void 0,morphColors:K.morphAttributes.color!==void 0,morphTargetsCount:xe,morphTextureStride:ze,numDirLights:C.directional.length,numPointLights:C.point.length,numSpotLights:C.spot.length,numSpotLightMaps:C.spotLightMap.length,numRectAreaLights:C.rectArea.length,numHemiLights:C.hemi.length,numDirLightShadows:C.directionalShadowMap.length,numPointLightShadows:C.pointShadowMap.length,numSpotLightShadows:C.spotShadowMap.length,numSpotLightShadowsWithMaps:C.numSpotLightShadowsWithMaps,numLightProbes:C.numLightProbes,numClippingPlanes:l.numPlanes,numClipIntersection:l.numIntersection,dithering:b.dithering,shadowMapEnabled:r.shadowMap.enabled&&G.length>0,shadowMapType:r.shadowMap.type,toneMapping:Sn,decodeVideoTexture:nt&&b.map.isVideoTexture===!0&&Lt.getTransfer(b.map.colorSpace)===zt,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===zi,flipSided:b.side===Bn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Gt&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Gt&&b.extensions.multiDraw===!0||st)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return wt.vertexUv1s=h.has(1),wt.vertexUv2s=h.has(2),wt.vertexUv3s=h.has(3),h.clear(),wt}function E(b){const C=[];if(b.shaderID?C.push(b.shaderID):(C.push(b.customVertexShaderID),C.push(b.customFragmentShaderID)),b.defines!==void 0)for(const G in b.defines)C.push(G),C.push(b.defines[G]);return b.isRawShaderMaterial===!1&&(w(C,b),T(C,b),C.push(r.outputColorSpace)),C.push(b.customProgramCacheKey),C.join()}function w(b,C){b.push(C.precision),b.push(C.outputColorSpace),b.push(C.envMapMode),b.push(C.envMapCubeUVHeight),b.push(C.mapUv),b.push(C.alphaMapUv),b.push(C.lightMapUv),b.push(C.aoMapUv),b.push(C.bumpMapUv),b.push(C.normalMapUv),b.push(C.displacementMapUv),b.push(C.emissiveMapUv),b.push(C.metalnessMapUv),b.push(C.roughnessMapUv),b.push(C.anisotropyMapUv),b.push(C.clearcoatMapUv),b.push(C.clearcoatNormalMapUv),b.push(C.clearcoatRoughnessMapUv),b.push(C.iridescenceMapUv),b.push(C.iridescenceThicknessMapUv),b.push(C.sheenColorMapUv),b.push(C.sheenRoughnessMapUv),b.push(C.specularMapUv),b.push(C.specularColorMapUv),b.push(C.specularIntensityMapUv),b.push(C.transmissionMapUv),b.push(C.thicknessMapUv),b.push(C.combine),b.push(C.fogExp2),b.push(C.sizeAttenuation),b.push(C.morphTargetsCount),b.push(C.morphAttributeCount),b.push(C.numDirLights),b.push(C.numPointLights),b.push(C.numSpotLights),b.push(C.numSpotLightMaps),b.push(C.numHemiLights),b.push(C.numRectAreaLights),b.push(C.numDirLightShadows),b.push(C.numPointLightShadows),b.push(C.numSpotLightShadows),b.push(C.numSpotLightShadowsWithMaps),b.push(C.numLightProbes),b.push(C.shadowMapType),b.push(C.toneMapping),b.push(C.numClippingPlanes),b.push(C.numClipIntersection),b.push(C.depthPacking)}function T(b,C){c.disableAll(),C.supportsVertexTextures&&c.enable(0),C.instancing&&c.enable(1),C.instancingColor&&c.enable(2),C.instancingMorph&&c.enable(3),C.matcap&&c.enable(4),C.envMap&&c.enable(5),C.normalMapObjectSpace&&c.enable(6),C.normalMapTangentSpace&&c.enable(7),C.clearcoat&&c.enable(8),C.iridescence&&c.enable(9),C.alphaTest&&c.enable(10),C.vertexColors&&c.enable(11),C.vertexAlphas&&c.enable(12),C.vertexUv1s&&c.enable(13),C.vertexUv2s&&c.enable(14),C.vertexUv3s&&c.enable(15),C.vertexTangents&&c.enable(16),C.anisotropy&&c.enable(17),C.alphaHash&&c.enable(18),C.batching&&c.enable(19),C.dispersion&&c.enable(20),C.batchingColor&&c.enable(21),b.push(c.mask),c.disableAll(),C.fog&&c.enable(0),C.useFog&&c.enable(1),C.flatShading&&c.enable(2),C.logarithmicDepthBuffer&&c.enable(3),C.reverseDepthBuffer&&c.enable(4),C.skinning&&c.enable(5),C.morphTargets&&c.enable(6),C.morphNormals&&c.enable(7),C.morphColors&&c.enable(8),C.premultipliedAlpha&&c.enable(9),C.shadowMapEnabled&&c.enable(10),C.doubleSided&&c.enable(11),C.flipSided&&c.enable(12),C.useDepthPacking&&c.enable(13),C.dithering&&c.enable(14),C.transmission&&c.enable(15),C.sheen&&c.enable(16),C.opaque&&c.enable(17),C.pointsUvs&&c.enable(18),C.decodeVideoTexture&&c.enable(19),C.alphaToCoverage&&c.enable(20),b.push(c.mask)}function O(b){const C=M[b.type];let G;if(C){const q=Ei[C];G=Vu.clone(q.uniforms)}else G=b.uniforms;return G}function P(b,C){let G;for(let q=0,Q=d.length;q<Q;q++){const ae=d[q];if(ae.cacheKey===C){G=ae,++G.usedTimes;break}}return G===void 0&&(G=new zA(r,C,b,s),d.push(G)),G}function L(b){if(--b.usedTimes===0){const C=d.indexOf(b);d[C]=d[d.length-1],d.pop(),b.destroy()}}function z(b){u.remove(b)}function X(){u.dispose()}return{getParameters:_,getProgramCacheKey:E,getUniforms:O,acquireProgram:P,releaseProgram:L,releaseShaderCache:z,programs:d,dispose:X}}function WA(){let r=new WeakMap;function e(l){return r.has(l)}function t(l){let c=r.get(l);return c===void 0&&(c={},r.set(l,c)),c}function n(l){r.delete(l)}function i(l,c,u){r.get(l)[c]=u}function s(){r=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:s}}function XA(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function g0(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function v0(){const r=[];let e=0;const t=[],n=[],i=[];function s(){e=0,t.length=0,n.length=0,i.length=0}function l(p,m,g,y,M,x){let _=r[e];return _===void 0?(_={id:p.id,object:p,geometry:m,material:g,groupOrder:y,renderOrder:p.renderOrder,z:M,group:x},r[e]=_):(_.id=p.id,_.object=p,_.geometry=m,_.material=g,_.groupOrder=y,_.renderOrder=p.renderOrder,_.z=M,_.group=x),e++,_}function c(p,m,g,y,M,x){const _=l(p,m,g,y,M,x);g.transmission>0?n.push(_):g.transparent===!0?i.push(_):t.push(_)}function u(p,m,g,y,M,x){const _=l(p,m,g,y,M,x);g.transmission>0?n.unshift(_):g.transparent===!0?i.unshift(_):t.unshift(_)}function h(p,m){t.length>1&&t.sort(p||XA),n.length>1&&n.sort(m||g0),i.length>1&&i.sort(m||g0)}function d(){for(let p=e,m=r.length;p<m;p++){const g=r[p];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:i,init:s,push:c,unshift:u,finish:d,sort:h}}function YA(){let r=new WeakMap;function e(n,i){const s=r.get(n);let l;return s===void 0?(l=new v0,r.set(n,[l])):i>=s.length?(l=new v0,s.push(l)):l=s[i],l}function t(){r=new WeakMap}return{get:e,dispose:t}}function qA(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new Ie};break;case"SpotLight":t={position:new D,direction:new D,color:new Ie,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new Ie,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new Ie,groundColor:new Ie};break;case"RectAreaLight":t={color:new Ie,position:new D,halfWidth:new D,halfHeight:new D};break}return r[e.id]=t,t}}}function ZA(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let JA=0;function KA(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function jA(r){const e=new qA,t=ZA(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)n.probe.push(new D);const i=new D,s=new et,l=new et;function c(h){let d=0,p=0,m=0;for(let X=0;X<9;X++)n.probe[X].set(0,0,0);let g=0,y=0,M=0,x=0,_=0,E=0,w=0,T=0,O=0,P=0,L=0;h.sort(KA);for(let X=0,b=h.length;X<b;X++){const C=h[X],G=C.color,q=C.intensity,Q=C.distance,ae=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)d+=G.r*q,p+=G.g*q,m+=G.b*q;else if(C.isLightProbe){for(let K=0;K<9;K++)n.probe[K].addScaledVector(C.sh.coefficients[K],q);L++}else if(C.isDirectionalLight){const K=e.get(C);if(K.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const me=C.shadow,F=t.get(C);F.shadowIntensity=me.intensity,F.shadowBias=me.bias,F.shadowNormalBias=me.normalBias,F.shadowRadius=me.radius,F.shadowMapSize=me.mapSize,n.directionalShadow[g]=F,n.directionalShadowMap[g]=ae,n.directionalShadowMatrix[g]=C.shadow.matrix,E++}n.directional[g]=K,g++}else if(C.isSpotLight){const K=e.get(C);K.position.setFromMatrixPosition(C.matrixWorld),K.color.copy(G).multiplyScalar(q),K.distance=Q,K.coneCos=Math.cos(C.angle),K.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),K.decay=C.decay,n.spot[M]=K;const me=C.shadow;if(C.map&&(n.spotLightMap[O]=C.map,O++,me.updateMatrices(C),C.castShadow&&P++),n.spotLightMatrix[M]=me.matrix,C.castShadow){const F=t.get(C);F.shadowIntensity=me.intensity,F.shadowBias=me.bias,F.shadowNormalBias=me.normalBias,F.shadowRadius=me.radius,F.shadowMapSize=me.mapSize,n.spotShadow[M]=F,n.spotShadowMap[M]=ae,T++}M++}else if(C.isRectAreaLight){const K=e.get(C);K.color.copy(G).multiplyScalar(q),K.halfWidth.set(C.width*.5,0,0),K.halfHeight.set(0,C.height*.5,0),n.rectArea[x]=K,x++}else if(C.isPointLight){const K=e.get(C);if(K.color.copy(C.color).multiplyScalar(C.intensity),K.distance=C.distance,K.decay=C.decay,C.castShadow){const me=C.shadow,F=t.get(C);F.shadowIntensity=me.intensity,F.shadowBias=me.bias,F.shadowNormalBias=me.normalBias,F.shadowRadius=me.radius,F.shadowMapSize=me.mapSize,F.shadowCameraNear=me.camera.near,F.shadowCameraFar=me.camera.far,n.pointShadow[y]=F,n.pointShadowMap[y]=ae,n.pointShadowMatrix[y]=C.shadow.matrix,w++}n.point[y]=K,y++}else if(C.isHemisphereLight){const K=e.get(C);K.skyColor.copy(C.color).multiplyScalar(q),K.groundColor.copy(C.groundColor).multiplyScalar(q),n.hemi[_]=K,_++}}x>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=be.LTC_FLOAT_1,n.rectAreaLTC2=be.LTC_FLOAT_2):(n.rectAreaLTC1=be.LTC_HALF_1,n.rectAreaLTC2=be.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=p,n.ambient[2]=m;const z=n.hash;(z.directionalLength!==g||z.pointLength!==y||z.spotLength!==M||z.rectAreaLength!==x||z.hemiLength!==_||z.numDirectionalShadows!==E||z.numPointShadows!==w||z.numSpotShadows!==T||z.numSpotMaps!==O||z.numLightProbes!==L)&&(n.directional.length=g,n.spot.length=M,n.rectArea.length=x,n.point.length=y,n.hemi.length=_,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=w,n.pointShadowMap.length=w,n.spotShadow.length=T,n.spotShadowMap.length=T,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=w,n.spotLightMatrix.length=T+O-P,n.spotLightMap.length=O,n.numSpotLightShadowsWithMaps=P,n.numLightProbes=L,z.directionalLength=g,z.pointLength=y,z.spotLength=M,z.rectAreaLength=x,z.hemiLength=_,z.numDirectionalShadows=E,z.numPointShadows=w,z.numSpotShadows=T,z.numSpotMaps=O,z.numLightProbes=L,n.version=JA++)}function u(h,d){let p=0,m=0,g=0,y=0,M=0;const x=d.matrixWorldInverse;for(let _=0,E=h.length;_<E;_++){const w=h[_];if(w.isDirectionalLight){const T=n.directional[p];T.direction.setFromMatrixPosition(w.matrixWorld),i.setFromMatrixPosition(w.target.matrixWorld),T.direction.sub(i),T.direction.transformDirection(x),p++}else if(w.isSpotLight){const T=n.spot[g];T.position.setFromMatrixPosition(w.matrixWorld),T.position.applyMatrix4(x),T.direction.setFromMatrixPosition(w.matrixWorld),i.setFromMatrixPosition(w.target.matrixWorld),T.direction.sub(i),T.direction.transformDirection(x),g++}else if(w.isRectAreaLight){const T=n.rectArea[y];T.position.setFromMatrixPosition(w.matrixWorld),T.position.applyMatrix4(x),l.identity(),s.copy(w.matrixWorld),s.premultiply(x),l.extractRotation(s),T.halfWidth.set(w.width*.5,0,0),T.halfHeight.set(0,w.height*.5,0),T.halfWidth.applyMatrix4(l),T.halfHeight.applyMatrix4(l),y++}else if(w.isPointLight){const T=n.point[m];T.position.setFromMatrixPosition(w.matrixWorld),T.position.applyMatrix4(x),m++}else if(w.isHemisphereLight){const T=n.hemi[M];T.direction.setFromMatrixPosition(w.matrixWorld),T.direction.transformDirection(x),M++}}}return{setup:c,setupView:u,state:n}}function _0(r){const e=new jA(r),t=[],n=[];function i(d){h.camera=d,t.length=0,n.length=0}function s(d){t.push(d)}function l(d){n.push(d)}function c(){e.setup(t)}function u(d){e.setupView(t,d)}const h={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:h,setupLights:c,setupLightsView:u,pushLight:s,pushShadow:l}}function QA(r){let e=new WeakMap;function t(i,s=0){const l=e.get(i);let c;return l===void 0?(c=new _0(r),e.set(i,[c])):s>=l.length?(c=new _0(r),l.push(c)):c=l[s],c}function n(){e=new WeakMap}return{get:t,dispose:n}}class Ap extends Pn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=g_,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Tp extends Pn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const $A=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,eT=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function tT(r,e,t){let n=new $a;const i=new fe,s=new fe,l=new yt,c=new Ap({depthPacking:v_}),u=new Tp,h={},d=t.maxTextureSize,p={[fr]:Bn,[Bn]:fr,[zi]:zi},m=new gi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new fe},radius:{value:4}},vertexShader:$A,fragmentShader:eT}),g=m.clone();g.defines.HORIZONTAL_PASS=1;const y=new gt;y.setAttribute("position",new Nt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new Qt(y,m),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ju;let _=this.type;this.render=function(P,L,z){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||P.length===0)return;const X=r.getRenderTarget(),b=r.getActiveCubeFace(),C=r.getActiveMipmapLevel(),G=r.state;G.setBlending(hr),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const q=_!==wi&&this.type===wi,Q=_===wi&&this.type!==wi;for(let ae=0,K=P.length;ae<K;ae++){const me=P[ae],F=me.shadow;if(F===void 0){console.warn("THREE.WebGLShadowMap:",me,"has no shadow.");continue}if(F.autoUpdate===!1&&F.needsUpdate===!1)continue;i.copy(F.mapSize);const J=F.getFrameExtents();if(i.multiply(J),s.copy(F.mapSize),(i.x>d||i.y>d)&&(i.x>d&&(s.x=Math.floor(d/J.x),i.x=s.x*J.x,F.mapSize.x=s.x),i.y>d&&(s.y=Math.floor(d/J.y),i.y=s.y*J.y,F.mapSize.y=s.y)),F.map===null||q===!0||Q===!0){const ie=this.type!==wi?{minFilter:dn,magFilter:dn}:{};F.map!==null&&F.map.dispose(),F.map=new Ti(i.x,i.y,ie),F.map.texture.name=me.name+".shadowMap",F.camera.updateProjectionMatrix()}r.setRenderTarget(F.map),r.clear();const Z=F.getViewportCount();for(let ie=0;ie<Z;ie++){const xe=F.getViewport(ie);l.set(s.x*xe.x,s.y*xe.y,s.x*xe.z,s.y*xe.w),G.viewport(l),F.updateMatrices(me,ie),n=F.getFrustum(),T(L,z,F.camera,me,this.type)}F.isPointLightShadow!==!0&&this.type===wi&&E(F,z),F.needsUpdate=!1}_=this.type,x.needsUpdate=!1,r.setRenderTarget(X,b,C)};function E(P,L){const z=e.update(M);m.defines.VSM_SAMPLES!==P.blurSamples&&(m.defines.VSM_SAMPLES=P.blurSamples,g.defines.VSM_SAMPLES=P.blurSamples,m.needsUpdate=!0,g.needsUpdate=!0),P.mapPass===null&&(P.mapPass=new Ti(i.x,i.y)),m.uniforms.shadow_pass.value=P.map.texture,m.uniforms.resolution.value=P.mapSize,m.uniforms.radius.value=P.radius,r.setRenderTarget(P.mapPass),r.clear(),r.renderBufferDirect(L,null,z,m,M,null),g.uniforms.shadow_pass.value=P.mapPass.texture,g.uniforms.resolution.value=P.mapSize,g.uniforms.radius.value=P.radius,r.setRenderTarget(P.map),r.clear(),r.renderBufferDirect(L,null,z,g,M,null)}function w(P,L,z,X){let b=null;const C=z.isPointLight===!0?P.customDistanceMaterial:P.customDepthMaterial;if(C!==void 0)b=C;else if(b=z.isPointLight===!0?u:c,r.localClippingEnabled&&L.clipShadows===!0&&Array.isArray(L.clippingPlanes)&&L.clippingPlanes.length!==0||L.displacementMap&&L.displacementScale!==0||L.alphaMap&&L.alphaTest>0||L.map&&L.alphaTest>0){const G=b.uuid,q=L.uuid;let Q=h[G];Q===void 0&&(Q={},h[G]=Q);let ae=Q[q];ae===void 0&&(ae=b.clone(),Q[q]=ae,L.addEventListener("dispose",O)),b=ae}if(b.visible=L.visible,b.wireframe=L.wireframe,X===wi?b.side=L.shadowSide!==null?L.shadowSide:L.side:b.side=L.shadowSide!==null?L.shadowSide:p[L.side],b.alphaMap=L.alphaMap,b.alphaTest=L.alphaTest,b.map=L.map,b.clipShadows=L.clipShadows,b.clippingPlanes=L.clippingPlanes,b.clipIntersection=L.clipIntersection,b.displacementMap=L.displacementMap,b.displacementScale=L.displacementScale,b.displacementBias=L.displacementBias,b.wireframeLinewidth=L.wireframeLinewidth,b.linewidth=L.linewidth,z.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const G=r.properties.get(b);G.light=z}return b}function T(P,L,z,X,b){if(P.visible===!1)return;if(P.layers.test(L.layers)&&(P.isMesh||P.isLine||P.isPoints)&&(P.castShadow||P.receiveShadow&&b===wi)&&(!P.frustumCulled||n.intersectsObject(P))){P.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,P.matrixWorld);const q=e.update(P),Q=P.material;if(Array.isArray(Q)){const ae=q.groups;for(let K=0,me=ae.length;K<me;K++){const F=ae[K],J=Q[F.materialIndex];if(J&&J.visible){const Z=w(P,J,X,b);P.onBeforeShadow(r,P,L,z,q,Z,F),r.renderBufferDirect(z,null,q,Z,P,F),P.onAfterShadow(r,P,L,z,q,Z,F)}}}else if(Q.visible){const ae=w(P,Q,X,b);P.onBeforeShadow(r,P,L,z,q,ae,null),r.renderBufferDirect(z,null,q,ae,P,null),P.onAfterShadow(r,P,L,z,q,ae,null)}}const G=P.children;for(let q=0,Q=G.length;q<Q;q++)T(G[q],L,z,X,b)}function O(P){P.target.removeEventListener("dispose",O);for(const z in h){const X=h[z],b=P.target.uuid;b in X&&(X[b].dispose(),delete X[b])}}}const nT={[lu]:cu,[uu]:du,[hu]:pu,[Es]:fu,[cu]:lu,[du]:uu,[pu]:hu,[fu]:Es};function iT(r){function e(){let H=!1;const Ne=new yt;let se=null;const pe=new yt(0,0,0,0);return{setMask:function(Le){se!==Le&&!H&&(r.colorMask(Le,Le,Le,Le),se=Le)},setLocked:function(Le){H=Le},setClear:function(Le,Oe,Mt,Gt,Sn){Sn===!0&&(Le*=Gt,Oe*=Gt,Mt*=Gt),Ne.set(Le,Oe,Mt,Gt),pe.equals(Ne)===!1&&(r.clearColor(Le,Oe,Mt,Gt),pe.copy(Ne))},reset:function(){H=!1,se=null,pe.set(-1,0,0,0)}}}function t(){let H=!1,Ne=!1,se=null,pe=null,Le=null;return{setReversed:function(Oe){Ne=Oe},setTest:function(Oe){Oe?Me(r.DEPTH_TEST):ye(r.DEPTH_TEST)},setMask:function(Oe){se!==Oe&&!H&&(r.depthMask(Oe),se=Oe)},setFunc:function(Oe){if(Ne&&(Oe=nT[Oe]),pe!==Oe){switch(Oe){case lu:r.depthFunc(r.NEVER);break;case cu:r.depthFunc(r.ALWAYS);break;case uu:r.depthFunc(r.LESS);break;case Es:r.depthFunc(r.LEQUAL);break;case hu:r.depthFunc(r.EQUAL);break;case fu:r.depthFunc(r.GEQUAL);break;case du:r.depthFunc(r.GREATER);break;case pu:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}pe=Oe}},setLocked:function(Oe){H=Oe},setClear:function(Oe){Le!==Oe&&(r.clearDepth(Oe),Le=Oe)},reset:function(){H=!1,se=null,pe=null,Le=null}}}function n(){let H=!1,Ne=null,se=null,pe=null,Le=null,Oe=null,Mt=null,Gt=null,Sn=null;return{setTest:function(wt){H||(wt?Me(r.STENCIL_TEST):ye(r.STENCIL_TEST))},setMask:function(wt){Ne!==wt&&!H&&(r.stencilMask(wt),Ne=wt)},setFunc:function(wt,gn,si){(se!==wt||pe!==gn||Le!==si)&&(r.stencilFunc(wt,gn,si),se=wt,pe=gn,Le=si)},setOp:function(wt,gn,si){(Oe!==wt||Mt!==gn||Gt!==si)&&(r.stencilOp(wt,gn,si),Oe=wt,Mt=gn,Gt=si)},setLocked:function(wt){H=wt},setClear:function(wt){Sn!==wt&&(r.clearStencil(wt),Sn=wt)},reset:function(){H=!1,Ne=null,se=null,pe=null,Le=null,Oe=null,Mt=null,Gt=null,Sn=null}}}const i=new e,s=new t,l=new n,c=new WeakMap,u=new WeakMap;let h={},d={},p=new WeakMap,m=[],g=null,y=!1,M=null,x=null,_=null,E=null,w=null,T=null,O=null,P=new Ie(0,0,0),L=0,z=!1,X=null,b=null,C=null,G=null,q=null;const Q=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let ae=!1,K=0;const me=r.getParameter(r.VERSION);me.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(me)[1]),ae=K>=1):me.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(me)[1]),ae=K>=2);let F=null,J={};const Z=r.getParameter(r.SCISSOR_BOX),ie=r.getParameter(r.VIEWPORT),xe=new yt().fromArray(Z),ze=new yt().fromArray(ie);function ne(H,Ne,se,pe){const Le=new Uint8Array(4),Oe=r.createTexture();r.bindTexture(H,Oe),r.texParameteri(H,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(H,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let Mt=0;Mt<se;Mt++)H===r.TEXTURE_3D||H===r.TEXTURE_2D_ARRAY?r.texImage3D(Ne,0,r.RGBA,1,1,pe,0,r.RGBA,r.UNSIGNED_BYTE,Le):r.texImage2D(Ne+Mt,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Le);return Oe}const de={};de[r.TEXTURE_2D]=ne(r.TEXTURE_2D,r.TEXTURE_2D,1),de[r.TEXTURE_CUBE_MAP]=ne(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),de[r.TEXTURE_2D_ARRAY]=ne(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),de[r.TEXTURE_3D]=ne(r.TEXTURE_3D,r.TEXTURE_3D,1,1),i.setClear(0,0,0,1),s.setClear(1),l.setClear(0),Me(r.DEPTH_TEST),s.setFunc(Es),we(!1),ge(Vd),Me(r.CULL_FACE),N(hr);function Me(H){h[H]!==!0&&(r.enable(H),h[H]=!0)}function ye(H){h[H]!==!1&&(r.disable(H),h[H]=!1)}function rt(H,Ne){return d[H]!==Ne?(r.bindFramebuffer(H,Ne),d[H]=Ne,H===r.DRAW_FRAMEBUFFER&&(d[r.FRAMEBUFFER]=Ne),H===r.FRAMEBUFFER&&(d[r.DRAW_FRAMEBUFFER]=Ne),!0):!1}function Qe(H,Ne){let se=m,pe=!1;if(H){se=p.get(Ne),se===void 0&&(se=[],p.set(Ne,se));const Le=H.textures;if(se.length!==Le.length||se[0]!==r.COLOR_ATTACHMENT0){for(let Oe=0,Mt=Le.length;Oe<Mt;Oe++)se[Oe]=r.COLOR_ATTACHMENT0+Oe;se.length=Le.length,pe=!0}}else se[0]!==r.BACK&&(se[0]=r.BACK,pe=!0);pe&&r.drawBuffers(se)}function st(H){return g!==H?(r.useProgram(H),g=H,!0):!1}const nt={[Or]:r.FUNC_ADD,[Hv]:r.FUNC_SUBTRACT,[Vv]:r.FUNC_REVERSE_SUBTRACT};nt[Gv]=r.MIN,nt[Wv]=r.MAX;const he={[Xv]:r.ZERO,[Yv]:r.ONE,[qv]:r.SRC_COLOR,[ou]:r.SRC_ALPHA,[$v]:r.SRC_ALPHA_SATURATE,[jv]:r.DST_COLOR,[Jv]:r.DST_ALPHA,[Zv]:r.ONE_MINUS_SRC_COLOR,[au]:r.ONE_MINUS_SRC_ALPHA,[Qv]:r.ONE_MINUS_DST_COLOR,[Kv]:r.ONE_MINUS_DST_ALPHA,[e_]:r.CONSTANT_COLOR,[t_]:r.ONE_MINUS_CONSTANT_COLOR,[n_]:r.CONSTANT_ALPHA,[i_]:r.ONE_MINUS_CONSTANT_ALPHA};function N(H,Ne,se,pe,Le,Oe,Mt,Gt,Sn,wt){if(H===hr){y===!0&&(ye(r.BLEND),y=!1);return}if(y===!1&&(Me(r.BLEND),y=!0),H!==kv){if(H!==M||wt!==z){if((x!==Or||w!==Or)&&(r.blendEquation(r.FUNC_ADD),x=Or,w=Or),wt)switch(H){case _s:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Gd:r.blendFunc(r.ONE,r.ONE);break;case Wd:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Xd:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",H);break}else switch(H){case _s:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Gd:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case Wd:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Xd:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",H);break}_=null,E=null,T=null,O=null,P.set(0,0,0),L=0,M=H,z=wt}return}Le=Le||Ne,Oe=Oe||se,Mt=Mt||pe,(Ne!==x||Le!==w)&&(r.blendEquationSeparate(nt[Ne],nt[Le]),x=Ne,w=Le),(se!==_||pe!==E||Oe!==T||Mt!==O)&&(r.blendFuncSeparate(he[se],he[pe],he[Oe],he[Mt]),_=se,E=pe,T=Oe,O=Mt),(Gt.equals(P)===!1||Sn!==L)&&(r.blendColor(Gt.r,Gt.g,Gt.b,Sn),P.copy(Gt),L=Sn),M=H,z=!1}function Ae(H,Ne){H.side===zi?ye(r.CULL_FACE):Me(r.CULL_FACE);let se=H.side===Bn;Ne&&(se=!se),we(se),H.blending===_s&&H.transparent===!1?N(hr):N(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),s.setFunc(H.depthFunc),s.setTest(H.depthTest),s.setMask(H.depthWrite),i.setMask(H.colorWrite);const pe=H.stencilWrite;l.setTest(pe),pe&&(l.setMask(H.stencilWriteMask),l.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),l.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),Je(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?Me(r.SAMPLE_ALPHA_TO_COVERAGE):ye(r.SAMPLE_ALPHA_TO_COVERAGE)}function we(H){X!==H&&(H?r.frontFace(r.CW):r.frontFace(r.CCW),X=H)}function ge(H){H!==Fv?(Me(r.CULL_FACE),H!==b&&(H===Vd?r.cullFace(r.BACK):H===Bv?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):ye(r.CULL_FACE),b=H}function Te(H){H!==C&&(ae&&r.lineWidth(H),C=H)}function Je(H,Ne,se){H?(Me(r.POLYGON_OFFSET_FILL),(G!==Ne||q!==se)&&(r.polygonOffset(Ne,se),G=Ne,q=se)):ye(r.POLYGON_OFFSET_FILL)}function Ue(H){H?Me(r.SCISSOR_TEST):ye(r.SCISSOR_TEST)}function U(H){H===void 0&&(H=r.TEXTURE0+Q-1),F!==H&&(r.activeTexture(H),F=H)}function R(H,Ne,se){se===void 0&&(F===null?se=r.TEXTURE0+Q-1:se=F);let pe=J[se];pe===void 0&&(pe={type:void 0,texture:void 0},J[se]=pe),(pe.type!==H||pe.texture!==Ne)&&(F!==se&&(r.activeTexture(se),F=se),r.bindTexture(H,Ne||de[H]),pe.type=H,pe.texture=Ne)}function j(){const H=J[F];H!==void 0&&H.type!==void 0&&(r.bindTexture(H.type,null),H.type=void 0,H.texture=void 0)}function le(){try{r.compressedTexImage2D.apply(r,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ue(){try{r.compressedTexImage3D.apply(r,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ce(){try{r.texSubImage2D.apply(r,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Ye(){try{r.texSubImage3D.apply(r,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Ce(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Fe(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function xt(){try{r.texStorage2D.apply(r,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ve(){try{r.texStorage3D.apply(r,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Be(){try{r.texImage2D.apply(r,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ot(){try{r.texImage3D.apply(r,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function at(H){xe.equals(H)===!1&&(r.scissor(H.x,H.y,H.z,H.w),xe.copy(H))}function ke(H){ze.equals(H)===!1&&(r.viewport(H.x,H.y,H.z,H.w),ze.copy(H))}function St(H,Ne){let se=u.get(Ne);se===void 0&&(se=new WeakMap,u.set(Ne,se));let pe=se.get(H);pe===void 0&&(pe=r.getUniformBlockIndex(Ne,H.name),se.set(H,pe))}function ct(H,Ne){const pe=u.get(Ne).get(H);c.get(Ne)!==pe&&(r.uniformBlockBinding(Ne,pe,H.__bindingPointIndex),c.set(Ne,pe))}function Ut(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),h={},F=null,J={},d={},p=new WeakMap,m=[],g=null,y=!1,M=null,x=null,_=null,E=null,w=null,T=null,O=null,P=new Ie(0,0,0),L=0,z=!1,X=null,b=null,C=null,G=null,q=null,xe.set(0,0,r.canvas.width,r.canvas.height),ze.set(0,0,r.canvas.width,r.canvas.height),i.reset(),s.reset(),l.reset()}return{buffers:{color:i,depth:s,stencil:l},enable:Me,disable:ye,bindFramebuffer:rt,drawBuffers:Qe,useProgram:st,setBlending:N,setMaterial:Ae,setFlipSided:we,setCullFace:ge,setLineWidth:Te,setPolygonOffset:Je,setScissorTest:Ue,activeTexture:U,bindTexture:R,unbindTexture:j,compressedTexImage2D:le,compressedTexImage3D:ue,texImage2D:Be,texImage3D:ot,updateUBOMapping:St,uniformBlockBinding:ct,texStorage2D:xt,texStorage3D:ve,texSubImage2D:ce,texSubImage3D:Ye,compressedTexSubImage2D:Ce,compressedTexSubImage3D:Fe,scissor:at,viewport:ke,reset:Ut}}function rT(r,e){const t=r.image&&r.image.width?r.image.width/r.image.height:1;return t>e?(r.repeat.x=1,r.repeat.y=t/e,r.offset.x=0,r.offset.y=(1-r.repeat.y)/2):(r.repeat.x=e/t,r.repeat.y=1,r.offset.x=(1-r.repeat.x)/2,r.offset.y=0),r}function sT(r,e){const t=r.image&&r.image.width?r.image.width/r.image.height:1;return t>e?(r.repeat.x=e/t,r.repeat.y=1,r.offset.x=(1-r.repeat.x)/2,r.offset.y=0):(r.repeat.x=1,r.repeat.y=t/e,r.offset.x=0,r.offset.y=(1-r.repeat.y)/2),r}function oT(r){return r.repeat.x=1,r.repeat.y=1,r.offset.x=0,r.offset.y=0,r}function jd(r,e,t,n){const i=aT(n);switch(t){case hp:return r*e;case dp:return r*e;case pp:return r*e*2;case eh:return r*e/i.components*i.byteLength;case Ja:return r*e/i.components*i.byteLength;case mp:return r*e*2/i.components*i.byteLength;case th:return r*e*2/i.components*i.byteLength;case fp:return r*e*3/i.components*i.byteLength;case Rn:return r*e*4/i.components*i.byteLength;case nh:return r*e*4/i.components*i.byteLength;case ya:case xa:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Sa:case Ma:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case gu:case _u:return Math.max(r,16)*Math.max(e,8)/4;case mu:case vu:return Math.max(r,8)*Math.max(e,8)/2;case yu:case xu:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Su:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Mu:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case wu:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case Eu:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case Au:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case Tu:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case bu:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case Cu:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case Ru:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case Pu:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case Iu:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case Lu:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case Du:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case Uu:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case Nu:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case wa:case Ou:case Fu:return Math.ceil(r/4)*Math.ceil(e/4)*16;case gp:case Bu:return Math.ceil(r/4)*Math.ceil(e/4)*8;case zu:case ku:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function aT(r){switch(r){case Ai:case lp:return{byteLength:1,components:1};case Eo:case cp:case Po:return{byteLength:2,components:1};case Qu:case $u:return{byteLength:2,components:4};case pr:case ju:case Yn:return{byteLength:4,components:1};case up:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}const lT={contain:rT,cover:sT,fill:oT,getByteLength:jd};function cT(r,e,t,n,i,s,l){const c=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,u=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new fe,d=new WeakMap;let p;const m=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(U,R){return g?new OffscreenCanvas(U,R):Ba("canvas")}function M(U,R,j){let le=1;const ue=Ue(U);if((ue.width>j||ue.height>j)&&(le=j/Math.max(ue.width,ue.height)),le<1)if(typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&U instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&U instanceof ImageBitmap||typeof VideoFrame<"u"&&U instanceof VideoFrame){const ce=Math.floor(le*ue.width),Ye=Math.floor(le*ue.height);p===void 0&&(p=y(ce,Ye));const Ce=R?y(ce,Ye):p;return Ce.width=ce,Ce.height=Ye,Ce.getContext("2d").drawImage(U,0,0,ce,Ye),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ue.width+"x"+ue.height+") to ("+ce+"x"+Ye+")."),Ce}else return"data"in U&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ue.width+"x"+ue.height+")."),U;return U}function x(U){return U.generateMipmaps&&U.minFilter!==dn&&U.minFilter!==nn}function _(U){r.generateMipmap(U)}function E(U,R,j,le,ue=!1){if(U!==null){if(r[U]!==void 0)return r[U];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+U+"'")}let ce=R;if(R===r.RED&&(j===r.FLOAT&&(ce=r.R32F),j===r.HALF_FLOAT&&(ce=r.R16F),j===r.UNSIGNED_BYTE&&(ce=r.R8)),R===r.RED_INTEGER&&(j===r.UNSIGNED_BYTE&&(ce=r.R8UI),j===r.UNSIGNED_SHORT&&(ce=r.R16UI),j===r.UNSIGNED_INT&&(ce=r.R32UI),j===r.BYTE&&(ce=r.R8I),j===r.SHORT&&(ce=r.R16I),j===r.INT&&(ce=r.R32I)),R===r.RG&&(j===r.FLOAT&&(ce=r.RG32F),j===r.HALF_FLOAT&&(ce=r.RG16F),j===r.UNSIGNED_BYTE&&(ce=r.RG8)),R===r.RG_INTEGER&&(j===r.UNSIGNED_BYTE&&(ce=r.RG8UI),j===r.UNSIGNED_SHORT&&(ce=r.RG16UI),j===r.UNSIGNED_INT&&(ce=r.RG32UI),j===r.BYTE&&(ce=r.RG8I),j===r.SHORT&&(ce=r.RG16I),j===r.INT&&(ce=r.RG32I)),R===r.RGB_INTEGER&&(j===r.UNSIGNED_BYTE&&(ce=r.RGB8UI),j===r.UNSIGNED_SHORT&&(ce=r.RGB16UI),j===r.UNSIGNED_INT&&(ce=r.RGB32UI),j===r.BYTE&&(ce=r.RGB8I),j===r.SHORT&&(ce=r.RGB16I),j===r.INT&&(ce=r.RGB32I)),R===r.RGBA_INTEGER&&(j===r.UNSIGNED_BYTE&&(ce=r.RGBA8UI),j===r.UNSIGNED_SHORT&&(ce=r.RGBA16UI),j===r.UNSIGNED_INT&&(ce=r.RGBA32UI),j===r.BYTE&&(ce=r.RGBA8I),j===r.SHORT&&(ce=r.RGBA16I),j===r.INT&&(ce=r.RGBA32I)),R===r.RGB&&j===r.UNSIGNED_INT_5_9_9_9_REV&&(ce=r.RGB9_E5),R===r.RGBA){const Ye=ue?Da:Lt.getTransfer(le);j===r.FLOAT&&(ce=r.RGBA32F),j===r.HALF_FLOAT&&(ce=r.RGBA16F),j===r.UNSIGNED_BYTE&&(ce=Ye===zt?r.SRGB8_ALPHA8:r.RGBA8),j===r.UNSIGNED_SHORT_4_4_4_4&&(ce=r.RGBA4),j===r.UNSIGNED_SHORT_5_5_5_1&&(ce=r.RGB5_A1)}return(ce===r.R16F||ce===r.R32F||ce===r.RG16F||ce===r.RG32F||ce===r.RGBA16F||ce===r.RGBA32F)&&e.get("EXT_color_buffer_float"),ce}function w(U,R){let j;return U?R===null||R===pr||R===As?j=r.DEPTH24_STENCIL8:R===Yn?j=r.DEPTH32F_STENCIL8:R===Eo&&(j=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):R===null||R===pr||R===As?j=r.DEPTH_COMPONENT24:R===Yn?j=r.DEPTH_COMPONENT32F:R===Eo&&(j=r.DEPTH_COMPONENT16),j}function T(U,R){return x(U)===!0||U.isFramebufferTexture&&U.minFilter!==dn&&U.minFilter!==nn?Math.log2(Math.max(R.width,R.height))+1:U.mipmaps!==void 0&&U.mipmaps.length>0?U.mipmaps.length:U.isCompressedTexture&&Array.isArray(U.image)?R.mipmaps.length:1}function O(U){const R=U.target;R.removeEventListener("dispose",O),L(R),R.isVideoTexture&&d.delete(R)}function P(U){const R=U.target;R.removeEventListener("dispose",P),X(R)}function L(U){const R=n.get(U);if(R.__webglInit===void 0)return;const j=U.source,le=m.get(j);if(le){const ue=le[R.__cacheKey];ue.usedTimes--,ue.usedTimes===0&&z(U),Object.keys(le).length===0&&m.delete(j)}n.remove(U)}function z(U){const R=n.get(U);r.deleteTexture(R.__webglTexture);const j=U.source,le=m.get(j);delete le[R.__cacheKey],l.memory.textures--}function X(U){const R=n.get(U);if(U.depthTexture&&U.depthTexture.dispose(),U.isWebGLCubeRenderTarget)for(let le=0;le<6;le++){if(Array.isArray(R.__webglFramebuffer[le]))for(let ue=0;ue<R.__webglFramebuffer[le].length;ue++)r.deleteFramebuffer(R.__webglFramebuffer[le][ue]);else r.deleteFramebuffer(R.__webglFramebuffer[le]);R.__webglDepthbuffer&&r.deleteRenderbuffer(R.__webglDepthbuffer[le])}else{if(Array.isArray(R.__webglFramebuffer))for(let le=0;le<R.__webglFramebuffer.length;le++)r.deleteFramebuffer(R.__webglFramebuffer[le]);else r.deleteFramebuffer(R.__webglFramebuffer);if(R.__webglDepthbuffer&&r.deleteRenderbuffer(R.__webglDepthbuffer),R.__webglMultisampledFramebuffer&&r.deleteFramebuffer(R.__webglMultisampledFramebuffer),R.__webglColorRenderbuffer)for(let le=0;le<R.__webglColorRenderbuffer.length;le++)R.__webglColorRenderbuffer[le]&&r.deleteRenderbuffer(R.__webglColorRenderbuffer[le]);R.__webglDepthRenderbuffer&&r.deleteRenderbuffer(R.__webglDepthRenderbuffer)}const j=U.textures;for(let le=0,ue=j.length;le<ue;le++){const ce=n.get(j[le]);ce.__webglTexture&&(r.deleteTexture(ce.__webglTexture),l.memory.textures--),n.remove(j[le])}n.remove(U)}let b=0;function C(){b=0}function G(){const U=b;return U>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+U+" texture units while this GPU supports only "+i.maxTextures),b+=1,U}function q(U){const R=[];return R.push(U.wrapS),R.push(U.wrapT),R.push(U.wrapR||0),R.push(U.magFilter),R.push(U.minFilter),R.push(U.anisotropy),R.push(U.internalFormat),R.push(U.format),R.push(U.type),R.push(U.generateMipmaps),R.push(U.premultiplyAlpha),R.push(U.flipY),R.push(U.unpackAlignment),R.push(U.colorSpace),R.join()}function Q(U,R){const j=n.get(U);if(U.isVideoTexture&&Te(U),U.isRenderTargetTexture===!1&&U.version>0&&j.__version!==U.version){const le=U.image;if(le===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(le.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ze(j,U,R);return}}t.bindTexture(r.TEXTURE_2D,j.__webglTexture,r.TEXTURE0+R)}function ae(U,R){const j=n.get(U);if(U.version>0&&j.__version!==U.version){ze(j,U,R);return}t.bindTexture(r.TEXTURE_2D_ARRAY,j.__webglTexture,r.TEXTURE0+R)}function K(U,R){const j=n.get(U);if(U.version>0&&j.__version!==U.version){ze(j,U,R);return}t.bindTexture(r.TEXTURE_3D,j.__webglTexture,r.TEXTURE0+R)}function me(U,R){const j=n.get(U);if(U.version>0&&j.__version!==U.version){ne(j,U,R);return}t.bindTexture(r.TEXTURE_CUBE_MAP,j.__webglTexture,r.TEXTURE0+R)}const F={[Ra]:r.REPEAT,[mi]:r.CLAMP_TO_EDGE,[Pa]:r.MIRRORED_REPEAT},J={[dn]:r.NEAREST,[ap]:r.NEAREST_MIPMAP_NEAREST,[vo]:r.NEAREST_MIPMAP_LINEAR,[nn]:r.LINEAR,[_a]:r.LINEAR_MIPMAP_NEAREST,[Hi]:r.LINEAR_MIPMAP_LINEAR},Z={[y_]:r.NEVER,[A_]:r.ALWAYS,[x_]:r.LESS,[_p]:r.LEQUAL,[S_]:r.EQUAL,[E_]:r.GEQUAL,[M_]:r.GREATER,[w_]:r.NOTEQUAL};function ie(U,R){if(R.type===Yn&&e.has("OES_texture_float_linear")===!1&&(R.magFilter===nn||R.magFilter===_a||R.magFilter===vo||R.magFilter===Hi||R.minFilter===nn||R.minFilter===_a||R.minFilter===vo||R.minFilter===Hi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(U,r.TEXTURE_WRAP_S,F[R.wrapS]),r.texParameteri(U,r.TEXTURE_WRAP_T,F[R.wrapT]),(U===r.TEXTURE_3D||U===r.TEXTURE_2D_ARRAY)&&r.texParameteri(U,r.TEXTURE_WRAP_R,F[R.wrapR]),r.texParameteri(U,r.TEXTURE_MAG_FILTER,J[R.magFilter]),r.texParameteri(U,r.TEXTURE_MIN_FILTER,J[R.minFilter]),R.compareFunction&&(r.texParameteri(U,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(U,r.TEXTURE_COMPARE_FUNC,Z[R.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(R.magFilter===dn||R.minFilter!==vo&&R.minFilter!==Hi||R.type===Yn&&e.has("OES_texture_float_linear")===!1)return;if(R.anisotropy>1||n.get(R).__currentAnisotropy){const j=e.get("EXT_texture_filter_anisotropic");r.texParameterf(U,j.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(R.anisotropy,i.getMaxAnisotropy())),n.get(R).__currentAnisotropy=R.anisotropy}}}function xe(U,R){let j=!1;U.__webglInit===void 0&&(U.__webglInit=!0,R.addEventListener("dispose",O));const le=R.source;let ue=m.get(le);ue===void 0&&(ue={},m.set(le,ue));const ce=q(R);if(ce!==U.__cacheKey){ue[ce]===void 0&&(ue[ce]={texture:r.createTexture(),usedTimes:0},l.memory.textures++,j=!0),ue[ce].usedTimes++;const Ye=ue[U.__cacheKey];Ye!==void 0&&(ue[U.__cacheKey].usedTimes--,Ye.usedTimes===0&&z(R)),U.__cacheKey=ce,U.__webglTexture=ue[ce].texture}return j}function ze(U,R,j){let le=r.TEXTURE_2D;(R.isDataArrayTexture||R.isCompressedArrayTexture)&&(le=r.TEXTURE_2D_ARRAY),R.isData3DTexture&&(le=r.TEXTURE_3D);const ue=xe(U,R),ce=R.source;t.bindTexture(le,U.__webglTexture,r.TEXTURE0+j);const Ye=n.get(ce);if(ce.version!==Ye.__version||ue===!0){t.activeTexture(r.TEXTURE0+j);const Ce=Lt.getPrimaries(Lt.workingColorSpace),Fe=R.colorSpace===ar?null:Lt.getPrimaries(R.colorSpace),xt=R.colorSpace===ar||Ce===Fe?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,R.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,R.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,xt);let ve=M(R.image,!1,i.maxTextureSize);ve=Je(R,ve);const Be=s.convert(R.format,R.colorSpace),ot=s.convert(R.type);let at=E(R.internalFormat,Be,ot,R.colorSpace,R.isVideoTexture);ie(le,R);let ke;const St=R.mipmaps,ct=R.isVideoTexture!==!0,Ut=Ye.__version===void 0||ue===!0,H=ce.dataReady,Ne=T(R,ve);if(R.isDepthTexture)at=w(R.format===Ts,R.type),Ut&&(ct?t.texStorage2D(r.TEXTURE_2D,1,at,ve.width,ve.height):t.texImage2D(r.TEXTURE_2D,0,at,ve.width,ve.height,0,Be,ot,null));else if(R.isDataTexture)if(St.length>0){ct&&Ut&&t.texStorage2D(r.TEXTURE_2D,Ne,at,St[0].width,St[0].height);for(let se=0,pe=St.length;se<pe;se++)ke=St[se],ct?H&&t.texSubImage2D(r.TEXTURE_2D,se,0,0,ke.width,ke.height,Be,ot,ke.data):t.texImage2D(r.TEXTURE_2D,se,at,ke.width,ke.height,0,Be,ot,ke.data);R.generateMipmaps=!1}else ct?(Ut&&t.texStorage2D(r.TEXTURE_2D,Ne,at,ve.width,ve.height),H&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,ve.width,ve.height,Be,ot,ve.data)):t.texImage2D(r.TEXTURE_2D,0,at,ve.width,ve.height,0,Be,ot,ve.data);else if(R.isCompressedTexture)if(R.isCompressedArrayTexture){ct&&Ut&&t.texStorage3D(r.TEXTURE_2D_ARRAY,Ne,at,St[0].width,St[0].height,ve.depth);for(let se=0,pe=St.length;se<pe;se++)if(ke=St[se],R.format!==Rn)if(Be!==null)if(ct){if(H)if(R.layerUpdates.size>0){const Le=jd(ke.width,ke.height,R.format,R.type);for(const Oe of R.layerUpdates){const Mt=ke.data.subarray(Oe*Le/ke.data.BYTES_PER_ELEMENT,(Oe+1)*Le/ke.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,se,0,0,Oe,ke.width,ke.height,1,Be,Mt,0,0)}R.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,se,0,0,0,ke.width,ke.height,ve.depth,Be,ke.data,0,0)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,se,at,ke.width,ke.height,ve.depth,0,ke.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ct?H&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,se,0,0,0,ke.width,ke.height,ve.depth,Be,ot,ke.data):t.texImage3D(r.TEXTURE_2D_ARRAY,se,at,ke.width,ke.height,ve.depth,0,Be,ot,ke.data)}else{ct&&Ut&&t.texStorage2D(r.TEXTURE_2D,Ne,at,St[0].width,St[0].height);for(let se=0,pe=St.length;se<pe;se++)ke=St[se],R.format!==Rn?Be!==null?ct?H&&t.compressedTexSubImage2D(r.TEXTURE_2D,se,0,0,ke.width,ke.height,Be,ke.data):t.compressedTexImage2D(r.TEXTURE_2D,se,at,ke.width,ke.height,0,ke.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ct?H&&t.texSubImage2D(r.TEXTURE_2D,se,0,0,ke.width,ke.height,Be,ot,ke.data):t.texImage2D(r.TEXTURE_2D,se,at,ke.width,ke.height,0,Be,ot,ke.data)}else if(R.isDataArrayTexture)if(ct){if(Ut&&t.texStorage3D(r.TEXTURE_2D_ARRAY,Ne,at,ve.width,ve.height,ve.depth),H)if(R.layerUpdates.size>0){const se=jd(ve.width,ve.height,R.format,R.type);for(const pe of R.layerUpdates){const Le=ve.data.subarray(pe*se/ve.data.BYTES_PER_ELEMENT,(pe+1)*se/ve.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,pe,ve.width,ve.height,1,Be,ot,Le)}R.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,ve.width,ve.height,ve.depth,Be,ot,ve.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,at,ve.width,ve.height,ve.depth,0,Be,ot,ve.data);else if(R.isData3DTexture)ct?(Ut&&t.texStorage3D(r.TEXTURE_3D,Ne,at,ve.width,ve.height,ve.depth),H&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,ve.width,ve.height,ve.depth,Be,ot,ve.data)):t.texImage3D(r.TEXTURE_3D,0,at,ve.width,ve.height,ve.depth,0,Be,ot,ve.data);else if(R.isFramebufferTexture){if(Ut)if(ct)t.texStorage2D(r.TEXTURE_2D,Ne,at,ve.width,ve.height);else{let se=ve.width,pe=ve.height;for(let Le=0;Le<Ne;Le++)t.texImage2D(r.TEXTURE_2D,Le,at,se,pe,0,Be,ot,null),se>>=1,pe>>=1}}else if(St.length>0){if(ct&&Ut){const se=Ue(St[0]);t.texStorage2D(r.TEXTURE_2D,Ne,at,se.width,se.height)}for(let se=0,pe=St.length;se<pe;se++)ke=St[se],ct?H&&t.texSubImage2D(r.TEXTURE_2D,se,0,0,Be,ot,ke):t.texImage2D(r.TEXTURE_2D,se,at,Be,ot,ke);R.generateMipmaps=!1}else if(ct){if(Ut){const se=Ue(ve);t.texStorage2D(r.TEXTURE_2D,Ne,at,se.width,se.height)}H&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,Be,ot,ve)}else t.texImage2D(r.TEXTURE_2D,0,at,Be,ot,ve);x(R)&&_(le),Ye.__version=ce.version,R.onUpdate&&R.onUpdate(R)}U.__version=R.version}function ne(U,R,j){if(R.image.length!==6)return;const le=xe(U,R),ue=R.source;t.bindTexture(r.TEXTURE_CUBE_MAP,U.__webglTexture,r.TEXTURE0+j);const ce=n.get(ue);if(ue.version!==ce.__version||le===!0){t.activeTexture(r.TEXTURE0+j);const Ye=Lt.getPrimaries(Lt.workingColorSpace),Ce=R.colorSpace===ar?null:Lt.getPrimaries(R.colorSpace),Fe=R.colorSpace===ar||Ye===Ce?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,R.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,R.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Fe);const xt=R.isCompressedTexture||R.image[0].isCompressedTexture,ve=R.image[0]&&R.image[0].isDataTexture,Be=[];for(let pe=0;pe<6;pe++)!xt&&!ve?Be[pe]=M(R.image[pe],!0,i.maxCubemapSize):Be[pe]=ve?R.image[pe].image:R.image[pe],Be[pe]=Je(R,Be[pe]);const ot=Be[0],at=s.convert(R.format,R.colorSpace),ke=s.convert(R.type),St=E(R.internalFormat,at,ke,R.colorSpace),ct=R.isVideoTexture!==!0,Ut=ce.__version===void 0||le===!0,H=ue.dataReady;let Ne=T(R,ot);ie(r.TEXTURE_CUBE_MAP,R);let se;if(xt){ct&&Ut&&t.texStorage2D(r.TEXTURE_CUBE_MAP,Ne,St,ot.width,ot.height);for(let pe=0;pe<6;pe++){se=Be[pe].mipmaps;for(let Le=0;Le<se.length;Le++){const Oe=se[Le];R.format!==Rn?at!==null?ct?H&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Le,0,0,Oe.width,Oe.height,at,Oe.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Le,St,Oe.width,Oe.height,0,Oe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ct?H&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Le,0,0,Oe.width,Oe.height,at,ke,Oe.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Le,St,Oe.width,Oe.height,0,at,ke,Oe.data)}}}else{if(se=R.mipmaps,ct&&Ut){se.length>0&&Ne++;const pe=Ue(Be[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,Ne,St,pe.width,pe.height)}for(let pe=0;pe<6;pe++)if(ve){ct?H&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,0,0,Be[pe].width,Be[pe].height,at,ke,Be[pe].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,St,Be[pe].width,Be[pe].height,0,at,ke,Be[pe].data);for(let Le=0;Le<se.length;Le++){const Mt=se[Le].image[pe].image;ct?H&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Le+1,0,0,Mt.width,Mt.height,at,ke,Mt.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Le+1,St,Mt.width,Mt.height,0,at,ke,Mt.data)}}else{ct?H&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,0,0,at,ke,Be[pe]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,St,at,ke,Be[pe]);for(let Le=0;Le<se.length;Le++){const Oe=se[Le];ct?H&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Le+1,0,0,at,ke,Oe.image[pe]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Le+1,St,at,ke,Oe.image[pe])}}}x(R)&&_(r.TEXTURE_CUBE_MAP),ce.__version=ue.version,R.onUpdate&&R.onUpdate(R)}U.__version=R.version}function de(U,R,j,le,ue,ce){const Ye=s.convert(j.format,j.colorSpace),Ce=s.convert(j.type),Fe=E(j.internalFormat,Ye,Ce,j.colorSpace);if(!n.get(R).__hasExternalTextures){const ve=Math.max(1,R.width>>ce),Be=Math.max(1,R.height>>ce);ue===r.TEXTURE_3D||ue===r.TEXTURE_2D_ARRAY?t.texImage3D(ue,ce,Fe,ve,Be,R.depth,0,Ye,Ce,null):t.texImage2D(ue,ce,Fe,ve,Be,0,Ye,Ce,null)}t.bindFramebuffer(r.FRAMEBUFFER,U),ge(R)?c.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,le,ue,n.get(j).__webglTexture,0,we(R)):(ue===r.TEXTURE_2D||ue>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&ue<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,le,ue,n.get(j).__webglTexture,ce),t.bindFramebuffer(r.FRAMEBUFFER,null)}function Me(U,R,j){if(r.bindRenderbuffer(r.RENDERBUFFER,U),R.depthBuffer){const le=R.depthTexture,ue=le&&le.isDepthTexture?le.type:null,ce=w(R.stencilBuffer,ue),Ye=R.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Ce=we(R);ge(R)?c.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Ce,ce,R.width,R.height):j?r.renderbufferStorageMultisample(r.RENDERBUFFER,Ce,ce,R.width,R.height):r.renderbufferStorage(r.RENDERBUFFER,ce,R.width,R.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,Ye,r.RENDERBUFFER,U)}else{const le=R.textures;for(let ue=0;ue<le.length;ue++){const ce=le[ue],Ye=s.convert(ce.format,ce.colorSpace),Ce=s.convert(ce.type),Fe=E(ce.internalFormat,Ye,Ce,ce.colorSpace),xt=we(R);j&&ge(R)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,xt,Fe,R.width,R.height):ge(R)?c.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,xt,Fe,R.width,R.height):r.renderbufferStorage(r.RENDERBUFFER,Fe,R.width,R.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function ye(U,R){if(R&&R.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,U),!(R.depthTexture&&R.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(R.depthTexture).__webglTexture||R.depthTexture.image.width!==R.width||R.depthTexture.image.height!==R.height)&&(R.depthTexture.image.width=R.width,R.depthTexture.image.height=R.height,R.depthTexture.needsUpdate=!0),Q(R.depthTexture,0);const le=n.get(R.depthTexture).__webglTexture,ue=we(R);if(R.depthTexture.format===ys)ge(R)?c.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,le,0,ue):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,le,0);else if(R.depthTexture.format===Ts)ge(R)?c.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,le,0,ue):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,le,0);else throw new Error("Unknown depthTexture format")}function rt(U){const R=n.get(U),j=U.isWebGLCubeRenderTarget===!0;if(R.__boundDepthTexture!==U.depthTexture){const le=U.depthTexture;if(R.__depthDisposeCallback&&R.__depthDisposeCallback(),le){const ue=()=>{delete R.__boundDepthTexture,delete R.__depthDisposeCallback,le.removeEventListener("dispose",ue)};le.addEventListener("dispose",ue),R.__depthDisposeCallback=ue}R.__boundDepthTexture=le}if(U.depthTexture&&!R.__autoAllocateDepthBuffer){if(j)throw new Error("target.depthTexture not supported in Cube render targets");ye(R.__webglFramebuffer,U)}else if(j){R.__webglDepthbuffer=[];for(let le=0;le<6;le++)if(t.bindFramebuffer(r.FRAMEBUFFER,R.__webglFramebuffer[le]),R.__webglDepthbuffer[le]===void 0)R.__webglDepthbuffer[le]=r.createRenderbuffer(),Me(R.__webglDepthbuffer[le],U,!1);else{const ue=U.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ce=R.__webglDepthbuffer[le];r.bindRenderbuffer(r.RENDERBUFFER,ce),r.framebufferRenderbuffer(r.FRAMEBUFFER,ue,r.RENDERBUFFER,ce)}}else if(t.bindFramebuffer(r.FRAMEBUFFER,R.__webglFramebuffer),R.__webglDepthbuffer===void 0)R.__webglDepthbuffer=r.createRenderbuffer(),Me(R.__webglDepthbuffer,U,!1);else{const le=U.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ue=R.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,ue),r.framebufferRenderbuffer(r.FRAMEBUFFER,le,r.RENDERBUFFER,ue)}t.bindFramebuffer(r.FRAMEBUFFER,null)}function Qe(U,R,j){const le=n.get(U);R!==void 0&&de(le.__webglFramebuffer,U,U.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),j!==void 0&&rt(U)}function st(U){const R=U.texture,j=n.get(U),le=n.get(R);U.addEventListener("dispose",P);const ue=U.textures,ce=U.isWebGLCubeRenderTarget===!0,Ye=ue.length>1;if(Ye||(le.__webglTexture===void 0&&(le.__webglTexture=r.createTexture()),le.__version=R.version,l.memory.textures++),ce){j.__webglFramebuffer=[];for(let Ce=0;Ce<6;Ce++)if(R.mipmaps&&R.mipmaps.length>0){j.__webglFramebuffer[Ce]=[];for(let Fe=0;Fe<R.mipmaps.length;Fe++)j.__webglFramebuffer[Ce][Fe]=r.createFramebuffer()}else j.__webglFramebuffer[Ce]=r.createFramebuffer()}else{if(R.mipmaps&&R.mipmaps.length>0){j.__webglFramebuffer=[];for(let Ce=0;Ce<R.mipmaps.length;Ce++)j.__webglFramebuffer[Ce]=r.createFramebuffer()}else j.__webglFramebuffer=r.createFramebuffer();if(Ye)for(let Ce=0,Fe=ue.length;Ce<Fe;Ce++){const xt=n.get(ue[Ce]);xt.__webglTexture===void 0&&(xt.__webglTexture=r.createTexture(),l.memory.textures++)}if(U.samples>0&&ge(U)===!1){j.__webglMultisampledFramebuffer=r.createFramebuffer(),j.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,j.__webglMultisampledFramebuffer);for(let Ce=0;Ce<ue.length;Ce++){const Fe=ue[Ce];j.__webglColorRenderbuffer[Ce]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,j.__webglColorRenderbuffer[Ce]);const xt=s.convert(Fe.format,Fe.colorSpace),ve=s.convert(Fe.type),Be=E(Fe.internalFormat,xt,ve,Fe.colorSpace,U.isXRRenderTarget===!0),ot=we(U);r.renderbufferStorageMultisample(r.RENDERBUFFER,ot,Be,U.width,U.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ce,r.RENDERBUFFER,j.__webglColorRenderbuffer[Ce])}r.bindRenderbuffer(r.RENDERBUFFER,null),U.depthBuffer&&(j.__webglDepthRenderbuffer=r.createRenderbuffer(),Me(j.__webglDepthRenderbuffer,U,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(ce){t.bindTexture(r.TEXTURE_CUBE_MAP,le.__webglTexture),ie(r.TEXTURE_CUBE_MAP,R);for(let Ce=0;Ce<6;Ce++)if(R.mipmaps&&R.mipmaps.length>0)for(let Fe=0;Fe<R.mipmaps.length;Fe++)de(j.__webglFramebuffer[Ce][Fe],U,R,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,Fe);else de(j.__webglFramebuffer[Ce],U,R,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,0);x(R)&&_(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ye){for(let Ce=0,Fe=ue.length;Ce<Fe;Ce++){const xt=ue[Ce],ve=n.get(xt);t.bindTexture(r.TEXTURE_2D,ve.__webglTexture),ie(r.TEXTURE_2D,xt),de(j.__webglFramebuffer,U,xt,r.COLOR_ATTACHMENT0+Ce,r.TEXTURE_2D,0),x(xt)&&_(r.TEXTURE_2D)}t.unbindTexture()}else{let Ce=r.TEXTURE_2D;if((U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(Ce=U.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(Ce,le.__webglTexture),ie(Ce,R),R.mipmaps&&R.mipmaps.length>0)for(let Fe=0;Fe<R.mipmaps.length;Fe++)de(j.__webglFramebuffer[Fe],U,R,r.COLOR_ATTACHMENT0,Ce,Fe);else de(j.__webglFramebuffer,U,R,r.COLOR_ATTACHMENT0,Ce,0);x(R)&&_(Ce),t.unbindTexture()}U.depthBuffer&&rt(U)}function nt(U){const R=U.textures;for(let j=0,le=R.length;j<le;j++){const ue=R[j];if(x(ue)){const ce=U.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:r.TEXTURE_2D,Ye=n.get(ue).__webglTexture;t.bindTexture(ce,Ye),_(ce),t.unbindTexture()}}}const he=[],N=[];function Ae(U){if(U.samples>0){if(ge(U)===!1){const R=U.textures,j=U.width,le=U.height;let ue=r.COLOR_BUFFER_BIT;const ce=U.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Ye=n.get(U),Ce=R.length>1;if(Ce)for(let Fe=0;Fe<R.length;Fe++)t.bindFramebuffer(r.FRAMEBUFFER,Ye.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Fe,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,Ye.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Fe,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,Ye.__webglMultisampledFramebuffer),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,Ye.__webglFramebuffer);for(let Fe=0;Fe<R.length;Fe++){if(U.resolveDepthBuffer&&(U.depthBuffer&&(ue|=r.DEPTH_BUFFER_BIT),U.stencilBuffer&&U.resolveStencilBuffer&&(ue|=r.STENCIL_BUFFER_BIT)),Ce){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,Ye.__webglColorRenderbuffer[Fe]);const xt=n.get(R[Fe]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,xt,0)}r.blitFramebuffer(0,0,j,le,0,0,j,le,ue,r.NEAREST),u===!0&&(he.length=0,N.length=0,he.push(r.COLOR_ATTACHMENT0+Fe),U.depthBuffer&&U.resolveDepthBuffer===!1&&(he.push(ce),N.push(ce),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,N)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,he))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),Ce)for(let Fe=0;Fe<R.length;Fe++){t.bindFramebuffer(r.FRAMEBUFFER,Ye.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Fe,r.RENDERBUFFER,Ye.__webglColorRenderbuffer[Fe]);const xt=n.get(R[Fe]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,Ye.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Fe,r.TEXTURE_2D,xt,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,Ye.__webglMultisampledFramebuffer)}else if(U.depthBuffer&&U.resolveDepthBuffer===!1&&u){const R=U.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[R])}}}function we(U){return Math.min(i.maxSamples,U.samples)}function ge(U){const R=n.get(U);return U.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&R.__useRenderToTexture!==!1}function Te(U){const R=l.render.frame;d.get(U)!==R&&(d.set(U,R),U.update())}function Je(U,R){const j=U.colorSpace,le=U.format,ue=U.type;return U.isCompressedTexture===!0||U.isVideoTexture===!0||j!==gr&&j!==ar&&(Lt.getTransfer(j)===zt?(le!==Rn||ue!==Ai)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",j)),R}function Ue(U){return typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement?(h.width=U.naturalWidth||U.width,h.height=U.naturalHeight||U.height):typeof VideoFrame<"u"&&U instanceof VideoFrame?(h.width=U.displayWidth,h.height=U.displayHeight):(h.width=U.width,h.height=U.height),h}this.allocateTextureUnit=G,this.resetTextureUnits=C,this.setTexture2D=Q,this.setTexture2DArray=ae,this.setTexture3D=K,this.setTextureCube=me,this.rebindTextures=Qe,this.setupRenderTarget=st,this.updateRenderTargetMipmap=nt,this.updateMultisampleRenderTarget=Ae,this.setupDepthRenderbuffer=rt,this.setupFrameBufferTexture=de,this.useMultisampledRTT=ge}function k_(r,e){function t(n,i=ar){let s;const l=Lt.getTransfer(i);if(n===Ai)return r.UNSIGNED_BYTE;if(n===Qu)return r.UNSIGNED_SHORT_4_4_4_4;if(n===$u)return r.UNSIGNED_SHORT_5_5_5_1;if(n===up)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===lp)return r.BYTE;if(n===cp)return r.SHORT;if(n===Eo)return r.UNSIGNED_SHORT;if(n===ju)return r.INT;if(n===pr)return r.UNSIGNED_INT;if(n===Yn)return r.FLOAT;if(n===Po)return r.HALF_FLOAT;if(n===hp)return r.ALPHA;if(n===fp)return r.RGB;if(n===Rn)return r.RGBA;if(n===dp)return r.LUMINANCE;if(n===pp)return r.LUMINANCE_ALPHA;if(n===ys)return r.DEPTH_COMPONENT;if(n===Ts)return r.DEPTH_STENCIL;if(n===eh)return r.RED;if(n===Ja)return r.RED_INTEGER;if(n===mp)return r.RG;if(n===th)return r.RG_INTEGER;if(n===nh)return r.RGBA_INTEGER;if(n===ya||n===xa||n===Sa||n===Ma)if(l===zt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===ya)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===xa)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Sa)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ma)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===ya)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===xa)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Sa)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ma)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===mu||n===gu||n===vu||n===_u)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===mu)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===gu)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===vu)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===_u)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===yu||n===xu||n===Su)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===yu||n===xu)return l===zt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Su)return l===zt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Mu||n===wu||n===Eu||n===Au||n===Tu||n===bu||n===Cu||n===Ru||n===Pu||n===Iu||n===Lu||n===Du||n===Uu||n===Nu)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Mu)return l===zt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===wu)return l===zt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Eu)return l===zt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Au)return l===zt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Tu)return l===zt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===bu)return l===zt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Cu)return l===zt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ru)return l===zt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Pu)return l===zt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Iu)return l===zt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Lu)return l===zt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Du)return l===zt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Uu)return l===zt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Nu)return l===zt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===wa||n===Ou||n===Fu)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===wa)return l===zt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ou)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Fu)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===gp||n===Bu||n===zu||n===ku)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===wa)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Bu)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===zu)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ku)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===As?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:t}}class H_ extends fn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class xo extends bt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const uT={type:"move"};class ud{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new xo,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new xo,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new xo,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,l=null;const c=this._targetRay,u=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){l=!0;for(const M of e.hand.values()){const x=t.getJointPose(M,n),_=this._getHandJoint(h,M);x!==null&&(_.matrix.fromArray(x.transform.matrix),_.matrix.decompose(_.position,_.rotation,_.scale),_.matrixWorldNeedsUpdate=!0,_.jointRadius=x.radius),_.visible=x!==null}const d=h.joints["index-finger-tip"],p=h.joints["thumb-tip"],m=d.position.distanceTo(p.position),g=.02,y=.005;h.inputState.pinching&&m>g+y?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&m<=g-y&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else u!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(u.matrix.fromArray(s.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,s.linearVelocity?(u.hasLinearVelocity=!0,u.linearVelocity.copy(s.linearVelocity)):u.hasLinearVelocity=!1,s.angularVelocity?(u.hasAngularVelocity=!0,u.angularVelocity.copy(s.angularVelocity)):u.hasAngularVelocity=!1));c!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(c.matrix.fromArray(i.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,i.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(i.linearVelocity)):c.hasLinearVelocity=!1,i.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(i.angularVelocity)):c.hasAngularVelocity=!1,this.dispatchEvent(uT)))}return c!==null&&(c.visible=i!==null),u!==null&&(u.visible=s!==null),h!==null&&(h.visible=l!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new xo;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const hT=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,fT=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class dT{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const i=new Jt,s=e.properties.get(i);s.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new gi({vertexShader:hT,fragmentShader:fT,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Qt(new Rs(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class pT extends Yi{constructor(e,t){super();const n=this;let i=null,s=1,l=null,c="local-floor",u=1,h=null,d=null,p=null,m=null,g=null,y=null;const M=new dT,x=t.getContextAttributes();let _=null,E=null;const w=[],T=[],O=new fe;let P=null;const L=new fn;L.layers.enable(1),L.viewport=new yt;const z=new fn;z.layers.enable(2),z.viewport=new yt;const X=[L,z],b=new H_;b.layers.enable(1),b.layers.enable(2);let C=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ne){let de=w[ne];return de===void 0&&(de=new ud,w[ne]=de),de.getTargetRaySpace()},this.getControllerGrip=function(ne){let de=w[ne];return de===void 0&&(de=new ud,w[ne]=de),de.getGripSpace()},this.getHand=function(ne){let de=w[ne];return de===void 0&&(de=new ud,w[ne]=de),de.getHandSpace()};function q(ne){const de=T.indexOf(ne.inputSource);if(de===-1)return;const Me=w[de];Me!==void 0&&(Me.update(ne.inputSource,ne.frame,h||l),Me.dispatchEvent({type:ne.type,data:ne.inputSource}))}function Q(){i.removeEventListener("select",q),i.removeEventListener("selectstart",q),i.removeEventListener("selectend",q),i.removeEventListener("squeeze",q),i.removeEventListener("squeezestart",q),i.removeEventListener("squeezeend",q),i.removeEventListener("end",Q),i.removeEventListener("inputsourceschange",ae);for(let ne=0;ne<w.length;ne++){const de=T[ne];de!==null&&(T[ne]=null,w[ne].disconnect(de))}C=null,G=null,M.reset(),e.setRenderTarget(_),g=null,m=null,p=null,i=null,E=null,ze.stop(),n.isPresenting=!1,e.setPixelRatio(P),e.setSize(O.width,O.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ne){s=ne,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ne){c=ne,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||l},this.setReferenceSpace=function(ne){h=ne},this.getBaseLayer=function(){return m!==null?m:g},this.getBinding=function(){return p},this.getFrame=function(){return y},this.getSession=function(){return i},this.setSession=async function(ne){if(i=ne,i!==null){if(_=e.getRenderTarget(),i.addEventListener("select",q),i.addEventListener("selectstart",q),i.addEventListener("selectend",q),i.addEventListener("squeeze",q),i.addEventListener("squeezestart",q),i.addEventListener("squeezeend",q),i.addEventListener("end",Q),i.addEventListener("inputsourceschange",ae),x.xrCompatible!==!0&&await t.makeXRCompatible(),P=e.getPixelRatio(),e.getSize(O),i.renderState.layers===void 0){const de={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:s};g=new XRWebGLLayer(i,t,de),i.updateRenderState({baseLayer:g}),e.setPixelRatio(1),e.setSize(g.framebufferWidth,g.framebufferHeight,!1),E=new Ti(g.framebufferWidth,g.framebufferHeight,{format:Rn,type:Ai,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil})}else{let de=null,Me=null,ye=null;x.depth&&(ye=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,de=x.stencil?Ts:ys,Me=x.stencil?As:pr);const rt={colorFormat:t.RGBA8,depthFormat:ye,scaleFactor:s};p=new XRWebGLBinding(i,t),m=p.createProjectionLayer(rt),i.updateRenderState({layers:[m]}),e.setPixelRatio(1),e.setSize(m.textureWidth,m.textureHeight,!1),E=new Ti(m.textureWidth,m.textureHeight,{format:Rn,type:Ai,depthTexture:new Ep(m.textureWidth,m.textureHeight,Me,void 0,void 0,void 0,void 0,void 0,void 0,de),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:m.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(u),h=null,l=await i.requestReferenceSpace(c),ze.setContext(i),ze.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return M.getDepthTexture()};function ae(ne){for(let de=0;de<ne.removed.length;de++){const Me=ne.removed[de],ye=T.indexOf(Me);ye>=0&&(T[ye]=null,w[ye].disconnect(Me))}for(let de=0;de<ne.added.length;de++){const Me=ne.added[de];let ye=T.indexOf(Me);if(ye===-1){for(let Qe=0;Qe<w.length;Qe++)if(Qe>=T.length){T.push(Me),ye=Qe;break}else if(T[Qe]===null){T[Qe]=Me,ye=Qe;break}if(ye===-1)break}const rt=w[ye];rt&&rt.connect(Me)}}const K=new D,me=new D;function F(ne,de,Me){K.setFromMatrixPosition(de.matrixWorld),me.setFromMatrixPosition(Me.matrixWorld);const ye=K.distanceTo(me),rt=de.projectionMatrix.elements,Qe=Me.projectionMatrix.elements,st=rt[14]/(rt[10]-1),nt=rt[14]/(rt[10]+1),he=(rt[9]+1)/rt[5],N=(rt[9]-1)/rt[5],Ae=(rt[8]-1)/rt[0],we=(Qe[8]+1)/Qe[0],ge=st*Ae,Te=st*we,Je=ye/(-Ae+we),Ue=Je*-Ae;if(de.matrixWorld.decompose(ne.position,ne.quaternion,ne.scale),ne.translateX(Ue),ne.translateZ(Je),ne.matrixWorld.compose(ne.position,ne.quaternion,ne.scale),ne.matrixWorldInverse.copy(ne.matrixWorld).invert(),rt[10]===-1)ne.projectionMatrix.copy(de.projectionMatrix),ne.projectionMatrixInverse.copy(de.projectionMatrixInverse);else{const U=st+Je,R=nt+Je,j=ge-Ue,le=Te+(ye-Ue),ue=he*nt/R*U,ce=N*nt/R*U;ne.projectionMatrix.makePerspective(j,le,ue,ce,U,R),ne.projectionMatrixInverse.copy(ne.projectionMatrix).invert()}}function J(ne,de){de===null?ne.matrixWorld.copy(ne.matrix):ne.matrixWorld.multiplyMatrices(de.matrixWorld,ne.matrix),ne.matrixWorldInverse.copy(ne.matrixWorld).invert()}this.updateCamera=function(ne){if(i===null)return;let de=ne.near,Me=ne.far;M.texture!==null&&(M.depthNear>0&&(de=M.depthNear),M.depthFar>0&&(Me=M.depthFar)),b.near=z.near=L.near=de,b.far=z.far=L.far=Me,(C!==b.near||G!==b.far)&&(i.updateRenderState({depthNear:b.near,depthFar:b.far}),C=b.near,G=b.far);const ye=ne.parent,rt=b.cameras;J(b,ye);for(let Qe=0;Qe<rt.length;Qe++)J(rt[Qe],ye);rt.length===2?F(b,L,z):b.projectionMatrix.copy(L.projectionMatrix),Z(ne,b,ye)};function Z(ne,de,Me){Me===null?ne.matrix.copy(de.matrixWorld):(ne.matrix.copy(Me.matrixWorld),ne.matrix.invert(),ne.matrix.multiply(de.matrixWorld)),ne.matrix.decompose(ne.position,ne.quaternion,ne.scale),ne.updateMatrixWorld(!0),ne.projectionMatrix.copy(de.projectionMatrix),ne.projectionMatrixInverse.copy(de.projectionMatrixInverse),ne.isPerspectiveCamera&&(ne.fov=Ao*2*Math.atan(1/ne.projectionMatrix.elements[5]),ne.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(m===null&&g===null))return u},this.setFoveation=function(ne){u=ne,m!==null&&(m.fixedFoveation=ne),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=ne)},this.hasDepthSensing=function(){return M.texture!==null},this.getDepthSensingMesh=function(){return M.getMesh(b)};let ie=null;function xe(ne,de){if(d=de.getViewerPose(h||l),y=de,d!==null){const Me=d.views;g!==null&&(e.setRenderTargetFramebuffer(E,g.framebuffer),e.setRenderTarget(E));let ye=!1;Me.length!==b.cameras.length&&(b.cameras.length=0,ye=!0);for(let Qe=0;Qe<Me.length;Qe++){const st=Me[Qe];let nt=null;if(g!==null)nt=g.getViewport(st);else{const N=p.getViewSubImage(m,st);nt=N.viewport,Qe===0&&(e.setRenderTargetTextures(E,N.colorTexture,m.ignoreDepthValues?void 0:N.depthStencilTexture),e.setRenderTarget(E))}let he=X[Qe];he===void 0&&(he=new fn,he.layers.enable(Qe),he.viewport=new yt,X[Qe]=he),he.matrix.fromArray(st.transform.matrix),he.matrix.decompose(he.position,he.quaternion,he.scale),he.projectionMatrix.fromArray(st.projectionMatrix),he.projectionMatrixInverse.copy(he.projectionMatrix).invert(),he.viewport.set(nt.x,nt.y,nt.width,nt.height),Qe===0&&(b.matrix.copy(he.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),ye===!0&&b.cameras.push(he)}const rt=i.enabledFeatures;if(rt&&rt.includes("depth-sensing")){const Qe=p.getDepthInformation(Me[0]);Qe&&Qe.isValid&&Qe.texture&&M.init(e,Qe,i.renderState)}}for(let Me=0;Me<w.length;Me++){const ye=T[Me],rt=w[Me];ye!==null&&rt!==void 0&&rt.update(ye,de,h||l)}ie&&ie(ne,de),de.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:de}),y=null}const ze=new N_;ze.setAnimationLoop(xe),this.setAnimationLoop=function(ne){ie=ne},this.dispose=function(){}}}const is=new ri,mT=new et;function gT(r,e){function t(x,_){x.matrixAutoUpdate===!0&&x.updateMatrix(),_.value.copy(x.matrix)}function n(x,_){_.color.getRGB(x.fogColor.value,L_(r)),_.isFog?(x.fogNear.value=_.near,x.fogFar.value=_.far):_.isFogExp2&&(x.fogDensity.value=_.density)}function i(x,_,E,w,T){_.isMeshBasicMaterial||_.isMeshLambertMaterial?s(x,_):_.isMeshToonMaterial?(s(x,_),p(x,_)):_.isMeshPhongMaterial?(s(x,_),d(x,_)):_.isMeshStandardMaterial?(s(x,_),m(x,_),_.isMeshPhysicalMaterial&&g(x,_,T)):_.isMeshMatcapMaterial?(s(x,_),y(x,_)):_.isMeshDepthMaterial?s(x,_):_.isMeshDistanceMaterial?(s(x,_),M(x,_)):_.isMeshNormalMaterial?s(x,_):_.isLineBasicMaterial?(l(x,_),_.isLineDashedMaterial&&c(x,_)):_.isPointsMaterial?u(x,_,E,w):_.isSpriteMaterial?h(x,_):_.isShadowMaterial?(x.color.value.copy(_.color),x.opacity.value=_.opacity):_.isShaderMaterial&&(_.uniformsNeedUpdate=!1)}function s(x,_){x.opacity.value=_.opacity,_.color&&x.diffuse.value.copy(_.color),_.emissive&&x.emissive.value.copy(_.emissive).multiplyScalar(_.emissiveIntensity),_.map&&(x.map.value=_.map,t(_.map,x.mapTransform)),_.alphaMap&&(x.alphaMap.value=_.alphaMap,t(_.alphaMap,x.alphaMapTransform)),_.bumpMap&&(x.bumpMap.value=_.bumpMap,t(_.bumpMap,x.bumpMapTransform),x.bumpScale.value=_.bumpScale,_.side===Bn&&(x.bumpScale.value*=-1)),_.normalMap&&(x.normalMap.value=_.normalMap,t(_.normalMap,x.normalMapTransform),x.normalScale.value.copy(_.normalScale),_.side===Bn&&x.normalScale.value.negate()),_.displacementMap&&(x.displacementMap.value=_.displacementMap,t(_.displacementMap,x.displacementMapTransform),x.displacementScale.value=_.displacementScale,x.displacementBias.value=_.displacementBias),_.emissiveMap&&(x.emissiveMap.value=_.emissiveMap,t(_.emissiveMap,x.emissiveMapTransform)),_.specularMap&&(x.specularMap.value=_.specularMap,t(_.specularMap,x.specularMapTransform)),_.alphaTest>0&&(x.alphaTest.value=_.alphaTest);const E=e.get(_),w=E.envMap,T=E.envMapRotation;w&&(x.envMap.value=w,is.copy(T),is.x*=-1,is.y*=-1,is.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(is.y*=-1,is.z*=-1),x.envMapRotation.value.setFromMatrix4(mT.makeRotationFromEuler(is)),x.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,x.reflectivity.value=_.reflectivity,x.ior.value=_.ior,x.refractionRatio.value=_.refractionRatio),_.lightMap&&(x.lightMap.value=_.lightMap,x.lightMapIntensity.value=_.lightMapIntensity,t(_.lightMap,x.lightMapTransform)),_.aoMap&&(x.aoMap.value=_.aoMap,x.aoMapIntensity.value=_.aoMapIntensity,t(_.aoMap,x.aoMapTransform))}function l(x,_){x.diffuse.value.copy(_.color),x.opacity.value=_.opacity,_.map&&(x.map.value=_.map,t(_.map,x.mapTransform))}function c(x,_){x.dashSize.value=_.dashSize,x.totalSize.value=_.dashSize+_.gapSize,x.scale.value=_.scale}function u(x,_,E,w){x.diffuse.value.copy(_.color),x.opacity.value=_.opacity,x.size.value=_.size*E,x.scale.value=w*.5,_.map&&(x.map.value=_.map,t(_.map,x.uvTransform)),_.alphaMap&&(x.alphaMap.value=_.alphaMap,t(_.alphaMap,x.alphaMapTransform)),_.alphaTest>0&&(x.alphaTest.value=_.alphaTest)}function h(x,_){x.diffuse.value.copy(_.color),x.opacity.value=_.opacity,x.rotation.value=_.rotation,_.map&&(x.map.value=_.map,t(_.map,x.mapTransform)),_.alphaMap&&(x.alphaMap.value=_.alphaMap,t(_.alphaMap,x.alphaMapTransform)),_.alphaTest>0&&(x.alphaTest.value=_.alphaTest)}function d(x,_){x.specular.value.copy(_.specular),x.shininess.value=Math.max(_.shininess,1e-4)}function p(x,_){_.gradientMap&&(x.gradientMap.value=_.gradientMap)}function m(x,_){x.metalness.value=_.metalness,_.metalnessMap&&(x.metalnessMap.value=_.metalnessMap,t(_.metalnessMap,x.metalnessMapTransform)),x.roughness.value=_.roughness,_.roughnessMap&&(x.roughnessMap.value=_.roughnessMap,t(_.roughnessMap,x.roughnessMapTransform)),_.envMap&&(x.envMapIntensity.value=_.envMapIntensity)}function g(x,_,E){x.ior.value=_.ior,_.sheen>0&&(x.sheenColor.value.copy(_.sheenColor).multiplyScalar(_.sheen),x.sheenRoughness.value=_.sheenRoughness,_.sheenColorMap&&(x.sheenColorMap.value=_.sheenColorMap,t(_.sheenColorMap,x.sheenColorMapTransform)),_.sheenRoughnessMap&&(x.sheenRoughnessMap.value=_.sheenRoughnessMap,t(_.sheenRoughnessMap,x.sheenRoughnessMapTransform))),_.clearcoat>0&&(x.clearcoat.value=_.clearcoat,x.clearcoatRoughness.value=_.clearcoatRoughness,_.clearcoatMap&&(x.clearcoatMap.value=_.clearcoatMap,t(_.clearcoatMap,x.clearcoatMapTransform)),_.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=_.clearcoatRoughnessMap,t(_.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),_.clearcoatNormalMap&&(x.clearcoatNormalMap.value=_.clearcoatNormalMap,t(_.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(_.clearcoatNormalScale),_.side===Bn&&x.clearcoatNormalScale.value.negate())),_.dispersion>0&&(x.dispersion.value=_.dispersion),_.iridescence>0&&(x.iridescence.value=_.iridescence,x.iridescenceIOR.value=_.iridescenceIOR,x.iridescenceThicknessMinimum.value=_.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=_.iridescenceThicknessRange[1],_.iridescenceMap&&(x.iridescenceMap.value=_.iridescenceMap,t(_.iridescenceMap,x.iridescenceMapTransform)),_.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=_.iridescenceThicknessMap,t(_.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),_.transmission>0&&(x.transmission.value=_.transmission,x.transmissionSamplerMap.value=E.texture,x.transmissionSamplerSize.value.set(E.width,E.height),_.transmissionMap&&(x.transmissionMap.value=_.transmissionMap,t(_.transmissionMap,x.transmissionMapTransform)),x.thickness.value=_.thickness,_.thicknessMap&&(x.thicknessMap.value=_.thicknessMap,t(_.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=_.attenuationDistance,x.attenuationColor.value.copy(_.attenuationColor)),_.anisotropy>0&&(x.anisotropyVector.value.set(_.anisotropy*Math.cos(_.anisotropyRotation),_.anisotropy*Math.sin(_.anisotropyRotation)),_.anisotropyMap&&(x.anisotropyMap.value=_.anisotropyMap,t(_.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=_.specularIntensity,x.specularColor.value.copy(_.specularColor),_.specularColorMap&&(x.specularColorMap.value=_.specularColorMap,t(_.specularColorMap,x.specularColorMapTransform)),_.specularIntensityMap&&(x.specularIntensityMap.value=_.specularIntensityMap,t(_.specularIntensityMap,x.specularIntensityMapTransform))}function y(x,_){_.matcap&&(x.matcap.value=_.matcap)}function M(x,_){const E=e.get(_).light;x.referencePosition.value.setFromMatrixPosition(E.matrixWorld),x.nearDistance.value=E.shadow.camera.near,x.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function vT(r,e,t,n){let i={},s={},l=[];const c=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function u(E,w){const T=w.program;n.uniformBlockBinding(E,T)}function h(E,w){let T=i[E.id];T===void 0&&(y(E),T=d(E),i[E.id]=T,E.addEventListener("dispose",x));const O=w.program;n.updateUBOMapping(E,O);const P=e.render.frame;s[E.id]!==P&&(m(E),s[E.id]=P)}function d(E){const w=p();E.__bindingPointIndex=w;const T=r.createBuffer(),O=E.__size,P=E.usage;return r.bindBuffer(r.UNIFORM_BUFFER,T),r.bufferData(r.UNIFORM_BUFFER,O,P),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,w,T),T}function p(){for(let E=0;E<c;E++)if(l.indexOf(E)===-1)return l.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function m(E){const w=i[E.id],T=E.uniforms,O=E.__cache;r.bindBuffer(r.UNIFORM_BUFFER,w);for(let P=0,L=T.length;P<L;P++){const z=Array.isArray(T[P])?T[P]:[T[P]];for(let X=0,b=z.length;X<b;X++){const C=z[X];if(g(C,P,X,O)===!0){const G=C.__offset,q=Array.isArray(C.value)?C.value:[C.value];let Q=0;for(let ae=0;ae<q.length;ae++){const K=q[ae],me=M(K);typeof K=="number"||typeof K=="boolean"?(C.__data[0]=K,r.bufferSubData(r.UNIFORM_BUFFER,G+Q,C.__data)):K.isMatrix3?(C.__data[0]=K.elements[0],C.__data[1]=K.elements[1],C.__data[2]=K.elements[2],C.__data[3]=0,C.__data[4]=K.elements[3],C.__data[5]=K.elements[4],C.__data[6]=K.elements[5],C.__data[7]=0,C.__data[8]=K.elements[6],C.__data[9]=K.elements[7],C.__data[10]=K.elements[8],C.__data[11]=0):(K.toArray(C.__data,Q),Q+=me.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,G,C.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function g(E,w,T,O){const P=E.value,L=w+"_"+T;if(O[L]===void 0)return typeof P=="number"||typeof P=="boolean"?O[L]=P:O[L]=P.clone(),!0;{const z=O[L];if(typeof P=="number"||typeof P=="boolean"){if(z!==P)return O[L]=P,!0}else if(z.equals(P)===!1)return z.copy(P),!0}return!1}function y(E){const w=E.uniforms;let T=0;const O=16;for(let L=0,z=w.length;L<z;L++){const X=Array.isArray(w[L])?w[L]:[w[L]];for(let b=0,C=X.length;b<C;b++){const G=X[b],q=Array.isArray(G.value)?G.value:[G.value];for(let Q=0,ae=q.length;Q<ae;Q++){const K=q[Q],me=M(K),F=T%O,J=F%me.boundary,Z=F+J;T+=J,Z!==0&&O-Z<me.storage&&(T+=O-Z),G.__data=new Float32Array(me.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=T,T+=me.storage}}}const P=T%O;return P>0&&(T+=O-P),E.__size=T,E.__cache={},this}function M(E){const w={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(w.boundary=4,w.storage=4):E.isVector2?(w.boundary=8,w.storage=8):E.isVector3||E.isColor?(w.boundary=16,w.storage=12):E.isVector4?(w.boundary=16,w.storage=16):E.isMatrix3?(w.boundary=48,w.storage=48):E.isMatrix4?(w.boundary=64,w.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),w}function x(E){const w=E.target;w.removeEventListener("dispose",x);const T=l.indexOf(w.__bindingPointIndex);l.splice(T,1),r.deleteBuffer(i[w.id]),delete i[w.id],delete s[w.id]}function _(){for(const E in i)r.deleteBuffer(i[E]);l=[],i={},s={}}return{bind:u,update:h,dispose:_}}class V_{constructor(e={}){const{canvas:t=C_(),context:n=null,depth:i=!0,stencil:s=!1,alpha:l=!1,antialias:c=!1,premultipliedAlpha:u=!0,preserveDrawingBuffer:h=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:p=!1}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=l;const g=new Uint32Array(4),y=new Int32Array(4);let M=null,x=null;const _=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Wn,this.toneMapping=Gi,this.toneMappingExposure=1;const w=this;let T=!1,O=0,P=0,L=null,z=-1,X=null;const b=new yt,C=new yt;let G=null;const q=new Ie(0);let Q=0,ae=t.width,K=t.height,me=1,F=null,J=null;const Z=new yt(0,0,ae,K),ie=new yt(0,0,ae,K);let xe=!1;const ze=new $a;let ne=!1,de=!1;const Me=new et,ye=new et,rt=new D,Qe=new yt,st={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let nt=!1;function he(){return L===null?me:1}let N=n;function Ae(I,V){return t.getContext(I,V)}try{const I={alpha:!0,depth:i,stencil:s,antialias:c,premultipliedAlpha:u,preserveDrawingBuffer:h,powerPreference:d,failIfMajorPerformanceCaveat:p};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${qa}`),t.addEventListener("webglcontextlost",pe,!1),t.addEventListener("webglcontextrestored",Le,!1),t.addEventListener("webglcontextcreationerror",Oe,!1),N===null){const V="webgl2";if(N=Ae(V,I),N===null)throw Ae(V)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(I){throw console.error("THREE.WebGLRenderer: "+I.message),I}let we,ge,Te,Je,Ue,U,R,j,le,ue,ce,Ye,Ce,Fe,xt,ve,Be,ot,at,ke,St,ct,Ut,H;function Ne(){we=new wE(N),we.init(),ct=new k_(N,we),ge=new vE(N,we,e,ct),Te=new iT(N),ge.reverseDepthBuffer&&Te.buffers.depth.setReversed(!0),Je=new TE(N),Ue=new WA,U=new cT(N,we,Te,Ue,ge,ct,Je),R=new yE(w),j=new ME(w),le=new DM(N),Ut=new mE(N,le),ue=new EE(N,le,Je,Ut),ce=new CE(N,ue,le,Je),at=new bE(N,ge,U),ve=new _E(Ue),Ye=new GA(w,R,j,we,ge,Ut,ve),Ce=new gT(w,Ue),Fe=new YA,xt=new QA(we),ot=new pE(w,R,j,Te,ce,m,u),Be=new tT(w,ce,ge),H=new vT(N,Je,ge,Te),ke=new gE(N,we,Je),St=new AE(N,we,Je),Je.programs=Ye.programs,w.capabilities=ge,w.extensions=we,w.properties=Ue,w.renderLists=Fe,w.shadowMap=Be,w.state=Te,w.info=Je}Ne();const se=new pT(w,N);this.xr=se,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const I=we.get("WEBGL_lose_context");I&&I.loseContext()},this.forceContextRestore=function(){const I=we.get("WEBGL_lose_context");I&&I.restoreContext()},this.getPixelRatio=function(){return me},this.setPixelRatio=function(I){I!==void 0&&(me=I,this.setSize(ae,K,!1))},this.getSize=function(I){return I.set(ae,K)},this.setSize=function(I,V,ee=!0){if(se.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}ae=I,K=V,t.width=Math.floor(I*me),t.height=Math.floor(V*me),ee===!0&&(t.style.width=I+"px",t.style.height=V+"px"),this.setViewport(0,0,I,V)},this.getDrawingBufferSize=function(I){return I.set(ae*me,K*me).floor()},this.setDrawingBufferSize=function(I,V,ee){ae=I,K=V,me=ee,t.width=Math.floor(I*ee),t.height=Math.floor(V*ee),this.setViewport(0,0,I,V)},this.getCurrentViewport=function(I){return I.copy(b)},this.getViewport=function(I){return I.copy(Z)},this.setViewport=function(I,V,ee,te){I.isVector4?Z.set(I.x,I.y,I.z,I.w):Z.set(I,V,ee,te),Te.viewport(b.copy(Z).multiplyScalar(me).round())},this.getScissor=function(I){return I.copy(ie)},this.setScissor=function(I,V,ee,te){I.isVector4?ie.set(I.x,I.y,I.z,I.w):ie.set(I,V,ee,te),Te.scissor(C.copy(ie).multiplyScalar(me).round())},this.getScissorTest=function(){return xe},this.setScissorTest=function(I){Te.setScissorTest(xe=I)},this.setOpaqueSort=function(I){F=I},this.setTransparentSort=function(I){J=I},this.getClearColor=function(I){return I.copy(ot.getClearColor())},this.setClearColor=function(){ot.setClearColor.apply(ot,arguments)},this.getClearAlpha=function(){return ot.getClearAlpha()},this.setClearAlpha=function(){ot.setClearAlpha.apply(ot,arguments)},this.clear=function(I=!0,V=!0,ee=!0){let te=0;if(I){let Y=!1;if(L!==null){const Se=L.texture.format;Y=Se===nh||Se===th||Se===Ja}if(Y){const Se=L.texture.type,De=Se===Ai||Se===pr||Se===Eo||Se===As||Se===Qu||Se===$u,He=ot.getClearColor(),Ve=ot.getClearAlpha(),tt=He.r,it=He.g,qe=He.b;De?(g[0]=tt,g[1]=it,g[2]=qe,g[3]=Ve,N.clearBufferuiv(N.COLOR,0,g)):(y[0]=tt,y[1]=it,y[2]=qe,y[3]=Ve,N.clearBufferiv(N.COLOR,0,y))}else te|=N.COLOR_BUFFER_BIT}V&&(te|=N.DEPTH_BUFFER_BIT,N.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),ee&&(te|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(te)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",pe,!1),t.removeEventListener("webglcontextrestored",Le,!1),t.removeEventListener("webglcontextcreationerror",Oe,!1),Fe.dispose(),xt.dispose(),Ue.dispose(),R.dispose(),j.dispose(),ce.dispose(),Ut.dispose(),H.dispose(),Ye.dispose(),se.dispose(),se.removeEventListener("sessionstart",al),se.removeEventListener("sessionend",ll),Zi.stop()};function pe(I){I.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function Le(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;const I=Je.autoReset,V=Be.enabled,ee=Be.autoUpdate,te=Be.needsUpdate,Y=Be.type;Ne(),Je.autoReset=I,Be.enabled=V,Be.autoUpdate=ee,Be.needsUpdate=te,Be.type=Y}function Oe(I){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",I.statusMessage)}function Mt(I){const V=I.target;V.removeEventListener("dispose",Mt),Gt(V)}function Gt(I){Sn(I),Ue.remove(I)}function Sn(I){const V=Ue.get(I).programs;V!==void 0&&(V.forEach(function(ee){Ye.releaseProgram(ee)}),I.isShaderMaterial&&Ye.releaseShaderCache(I))}this.renderBufferDirect=function(I,V,ee,te,Y,Se){V===null&&(V=st);const De=Y.isMesh&&Y.matrixWorld.determinant()<0,He=bh(I,V,ee,te,Y);Te.setMaterial(te,De);let Ve=ee.index,tt=1;if(te.wireframe===!0){if(Ve=ue.getWireframeAttribute(ee),Ve===void 0)return;tt=2}const it=ee.drawRange,qe=ee.attributes.position;let At=it.start*tt,Ct=(it.start+it.count)*tt;Se!==null&&(At=Math.max(At,Se.start*tt),Ct=Math.min(Ct,(Se.start+Se.count)*tt)),Ve!==null?(At=Math.max(At,0),Ct=Math.min(Ct,Ve.count)):qe!=null&&(At=Math.max(At,0),Ct=Math.min(Ct,qe.count));const Dt=Ct-At;if(Dt<0||Dt===1/0)return;Ut.setup(Y,te,He,ee,Ve);let vt,Ke=ke;if(Ve!==null&&(vt=le.get(Ve),Ke=St,Ke.setIndex(vt)),Y.isMesh)te.wireframe===!0?(Te.setLineWidth(te.wireframeLinewidth*he()),Ke.setMode(N.LINES)):Ke.setMode(N.TRIANGLES);else if(Y.isLine){let We=te.linewidth;We===void 0&&(We=1),Te.setLineWidth(We*he()),Y.isLineSegments?Ke.setMode(N.LINES):Y.isLineLoop?Ke.setMode(N.LINE_LOOP):Ke.setMode(N.LINE_STRIP)}else Y.isPoints?Ke.setMode(N.POINTS):Y.isSprite&&Ke.setMode(N.TRIANGLES);if(Y.isBatchedMesh)if(Y._multiDrawInstances!==null)Ke.renderMultiDrawInstances(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount,Y._multiDrawInstances);else if(we.get("WEBGL_multi_draw"))Ke.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{const We=Y._multiDrawStarts,Et=Y._multiDrawCounts,lt=Y._multiDrawCount,rn=Ve?le.get(Ve).bytesPerElement:1,Jn=Ue.get(te).currentProgram.getUniforms();for(let Ot=0;Ot<lt;Ot++)Jn.setValue(N,"_gl_DrawID",Ot),Ke.render(We[Ot]/rn,Et[Ot])}else if(Y.isInstancedMesh)Ke.renderInstances(At,Dt,Y.count);else if(ee.isInstancedBufferGeometry){const We=ee._maxInstanceCount!==void 0?ee._maxInstanceCount:1/0,Et=Math.min(ee.instanceCount,We);Ke.renderInstances(At,Dt,Et)}else Ke.render(At,Dt)};function wt(I,V,ee){I.transparent===!0&&I.side===zi&&I.forceSinglePass===!1?(I.side=Bn,I.needsUpdate=!0,Ns(I,V,ee),I.side=fr,I.needsUpdate=!0,Ns(I,V,ee),I.side=zi):Ns(I,V,ee)}this.compile=function(I,V,ee=null){ee===null&&(ee=I),x=xt.get(ee),x.init(V),E.push(x),ee.traverseVisible(function(Y){Y.isLight&&Y.layers.test(V.layers)&&(x.pushLight(Y),Y.castShadow&&x.pushShadow(Y))}),I!==ee&&I.traverseVisible(function(Y){Y.isLight&&Y.layers.test(V.layers)&&(x.pushLight(Y),Y.castShadow&&x.pushShadow(Y))}),x.setupLights();const te=new Set;return I.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;const Se=Y.material;if(Se)if(Array.isArray(Se))for(let De=0;De<Se.length;De++){const He=Se[De];wt(He,ee,Y),te.add(He)}else wt(Se,ee,Y),te.add(Se)}),E.pop(),x=null,te},this.compileAsync=function(I,V,ee=null){const te=this.compile(I,V,ee);return new Promise(Y=>{function Se(){if(te.forEach(function(De){Ue.get(De).currentProgram.isReady()&&te.delete(De)}),te.size===0){Y(I);return}setTimeout(Se,10)}we.get("KHR_parallel_shader_compile")!==null?Se():setTimeout(Se,10)})};let gn=null;function si(I){gn&&gn(I)}function al(){Zi.stop()}function ll(){Zi.start()}const Zi=new N_;Zi.setAnimationLoop(si),typeof self<"u"&&Zi.setContext(self),this.setAnimationLoop=function(I){gn=I,se.setAnimationLoop(I),I===null?Zi.stop():Zi.start()},se.addEventListener("sessionstart",al),se.addEventListener("sessionend",ll),this.render=function(I,V){if(V!==void 0&&V.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),V.parent===null&&V.matrixWorldAutoUpdate===!0&&V.updateMatrixWorld(),se.enabled===!0&&se.isPresenting===!0&&(se.cameraAutoUpdate===!0&&se.updateCamera(V),V=se.getCamera()),I.isScene===!0&&I.onBeforeRender(w,I,V,L),x=xt.get(I,E.length),x.init(V),E.push(x),ye.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),ze.setFromProjectionMatrix(ye),de=this.localClippingEnabled,ne=ve.init(this.clippingPlanes,de),M=Fe.get(I,_.length),M.init(),_.push(M),se.enabled===!0&&se.isPresenting===!0){const Se=w.xr.getDepthSensingMesh();Se!==null&&Ds(Se,V,-1/0,w.sortObjects)}Ds(I,V,0,w.sortObjects),M.finish(),w.sortObjects===!0&&M.sort(F,J),nt=se.enabled===!1||se.isPresenting===!1||se.hasDepthSensing()===!1,nt&&ot.addToRenderList(M,I),this.info.render.frame++,ne===!0&&ve.beginShadows();const ee=x.state.shadowsArray;Be.render(ee,I,V),ne===!0&&ve.endShadows(),this.info.autoReset===!0&&this.info.reset();const te=M.opaque,Y=M.transmissive;if(x.setupLights(),V.isArrayCamera){const Se=V.cameras;if(Y.length>0)for(let De=0,He=Se.length;De<He;De++){const Ve=Se[De];cl(te,Y,I,Ve)}nt&&ot.render(I);for(let De=0,He=Se.length;De<He;De++){const Ve=Se[De];Us(M,I,Ve,Ve.viewport)}}else Y.length>0&&cl(te,Y,I,V),nt&&ot.render(I),Us(M,I,V);L!==null&&(U.updateMultisampleRenderTarget(L),U.updateRenderTargetMipmap(L)),I.isScene===!0&&I.onAfterRender(w,I,V),Ut.resetDefaultState(),z=-1,X=null,E.pop(),E.length>0?(x=E[E.length-1],ne===!0&&ve.setGlobalState(w.clippingPlanes,x.state.camera)):x=null,_.pop(),_.length>0?M=_[_.length-1]:M=null};function Ds(I,V,ee,te){if(I.visible===!1)return;if(I.layers.test(V.layers)){if(I.isGroup)ee=I.renderOrder;else if(I.isLOD)I.autoUpdate===!0&&I.update(V);else if(I.isLight)x.pushLight(I),I.castShadow&&x.pushShadow(I);else if(I.isSprite){if(!I.frustumCulled||ze.intersectsSprite(I)){te&&Qe.setFromMatrixPosition(I.matrixWorld).applyMatrix4(ye);const De=ce.update(I),He=I.material;He.visible&&M.push(I,De,He,ee,Qe.z,null)}}else if((I.isMesh||I.isLine||I.isPoints)&&(!I.frustumCulled||ze.intersectsObject(I))){const De=ce.update(I),He=I.material;if(te&&(I.boundingSphere!==void 0?(I.boundingSphere===null&&I.computeBoundingSphere(),Qe.copy(I.boundingSphere.center)):(De.boundingSphere===null&&De.computeBoundingSphere(),Qe.copy(De.boundingSphere.center)),Qe.applyMatrix4(I.matrixWorld).applyMatrix4(ye)),Array.isArray(He)){const Ve=De.groups;for(let tt=0,it=Ve.length;tt<it;tt++){const qe=Ve[tt],At=He[qe.materialIndex];At&&At.visible&&M.push(I,De,At,ee,Qe.z,qe)}}else He.visible&&M.push(I,De,He,ee,Qe.z,null)}}const Se=I.children;for(let De=0,He=Se.length;De<He;De++)Ds(Se[De],V,ee,te)}function Us(I,V,ee,te){const Y=I.opaque,Se=I.transmissive,De=I.transparent;x.setupLightsView(ee),ne===!0&&ve.setGlobalState(w.clippingPlanes,ee),te&&Te.viewport(b.copy(te)),Y.length>0&&Ri(Y,V,ee),Se.length>0&&Ri(Se,V,ee),De.length>0&&Ri(De,V,ee),Te.buffers.depth.setTest(!0),Te.buffers.depth.setMask(!0),Te.buffers.color.setMask(!0),Te.setPolygonOffset(!1)}function cl(I,V,ee,te){if((ee.isScene===!0?ee.overrideMaterial:null)!==null)return;x.state.transmissionRenderTarget[te.id]===void 0&&(x.state.transmissionRenderTarget[te.id]=new Ti(1,1,{generateMipmaps:!0,type:we.has("EXT_color_buffer_half_float")||we.has("EXT_color_buffer_float")?Po:Ai,minFilter:Hi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Lt.workingColorSpace}));const Se=x.state.transmissionRenderTarget[te.id],De=te.viewport||b;Se.setSize(De.z,De.w);const He=w.getRenderTarget();w.setRenderTarget(Se),w.getClearColor(q),Q=w.getClearAlpha(),Q<1&&w.setClearColor(16777215,.5),w.clear(),nt&&ot.render(ee);const Ve=w.toneMapping;w.toneMapping=Gi;const tt=te.viewport;if(te.viewport!==void 0&&(te.viewport=void 0),x.setupLightsView(te),ne===!0&&ve.setGlobalState(w.clippingPlanes,te),Ri(I,ee,te),U.updateMultisampleRenderTarget(Se),U.updateRenderTargetMipmap(Se),we.has("WEBGL_multisampled_render_to_texture")===!1){let it=!1;for(let qe=0,At=V.length;qe<At;qe++){const Ct=V[qe],Dt=Ct.object,vt=Ct.geometry,Ke=Ct.material,We=Ct.group;if(Ke.side===zi&&Dt.layers.test(te.layers)){const Et=Ke.side;Ke.side=Bn,Ke.needsUpdate=!0,ul(Dt,ee,te,vt,Ke,We),Ke.side=Et,Ke.needsUpdate=!0,it=!0}}it===!0&&(U.updateMultisampleRenderTarget(Se),U.updateRenderTargetMipmap(Se))}w.setRenderTarget(He),w.setClearColor(q,Q),tt!==void 0&&(te.viewport=tt),w.toneMapping=Ve}function Ri(I,V,ee){const te=V.isScene===!0?V.overrideMaterial:null;for(let Y=0,Se=I.length;Y<Se;Y++){const De=I[Y],He=De.object,Ve=De.geometry,tt=te===null?De.material:te,it=De.group;He.layers.test(ee.layers)&&ul(He,V,ee,Ve,tt,it)}}function ul(I,V,ee,te,Y,Se){I.onBeforeRender(w,V,ee,te,Y,Se),I.modelViewMatrix.multiplyMatrices(ee.matrixWorldInverse,I.matrixWorld),I.normalMatrix.getNormalMatrix(I.modelViewMatrix),Y.onBeforeRender(w,V,ee,te,I,Se),Y.transparent===!0&&Y.side===zi&&Y.forceSinglePass===!1?(Y.side=Bn,Y.needsUpdate=!0,w.renderBufferDirect(ee,V,te,Y,I,Se),Y.side=fr,Y.needsUpdate=!0,w.renderBufferDirect(ee,V,te,Y,I,Se),Y.side=zi):w.renderBufferDirect(ee,V,te,Y,I,Se),I.onAfterRender(w,V,ee,te,Y,Se)}function Ns(I,V,ee){V.isScene!==!0&&(V=st);const te=Ue.get(I),Y=x.state.lights,Se=x.state.shadowsArray,De=Y.state.version,He=Ye.getParameters(I,Y.state,Se,V,ee),Ve=Ye.getProgramCacheKey(He);let tt=te.programs;te.environment=I.isMeshStandardMaterial?V.environment:null,te.fog=V.fog,te.envMap=(I.isMeshStandardMaterial?j:R).get(I.envMap||te.environment),te.envMapRotation=te.environment!==null&&I.envMap===null?V.environmentRotation:I.envMapRotation,tt===void 0&&(I.addEventListener("dispose",Mt),tt=new Map,te.programs=tt);let it=tt.get(Ve);if(it!==void 0){if(te.currentProgram===it&&te.lightsStateVersion===De)return fl(I,He),it}else He.uniforms=Ye.getUniforms(I),I.onBeforeCompile(He,w),it=Ye.acquireProgram(He,Ve),tt.set(Ve,it),te.uniforms=He.uniforms;const qe=te.uniforms;return(!I.isShaderMaterial&&!I.isRawShaderMaterial||I.clipping===!0)&&(qe.clippingPlanes=ve.uniform),fl(I,He),te.needsLights=Rh(I),te.lightsStateVersion=De,te.needsLights&&(qe.ambientLightColor.value=Y.state.ambient,qe.lightProbe.value=Y.state.probe,qe.directionalLights.value=Y.state.directional,qe.directionalLightShadows.value=Y.state.directionalShadow,qe.spotLights.value=Y.state.spot,qe.spotLightShadows.value=Y.state.spotShadow,qe.rectAreaLights.value=Y.state.rectArea,qe.ltc_1.value=Y.state.rectAreaLTC1,qe.ltc_2.value=Y.state.rectAreaLTC2,qe.pointLights.value=Y.state.point,qe.pointLightShadows.value=Y.state.pointShadow,qe.hemisphereLights.value=Y.state.hemi,qe.directionalShadowMap.value=Y.state.directionalShadowMap,qe.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,qe.spotShadowMap.value=Y.state.spotShadowMap,qe.spotLightMatrix.value=Y.state.spotLightMatrix,qe.spotLightMap.value=Y.state.spotLightMap,qe.pointShadowMap.value=Y.state.pointShadowMap,qe.pointShadowMatrix.value=Y.state.pointShadowMatrix),te.currentProgram=it,te.uniformsList=null,it}function hl(I){if(I.uniformsList===null){const V=I.currentProgram.getUniforms();I.uniformsList=ru.seqWithValue(V.seq,I.uniforms)}return I.uniformsList}function fl(I,V){const ee=Ue.get(I);ee.outputColorSpace=V.outputColorSpace,ee.batching=V.batching,ee.batchingColor=V.batchingColor,ee.instancing=V.instancing,ee.instancingColor=V.instancingColor,ee.instancingMorph=V.instancingMorph,ee.skinning=V.skinning,ee.morphTargets=V.morphTargets,ee.morphNormals=V.morphNormals,ee.morphColors=V.morphColors,ee.morphTargetsCount=V.morphTargetsCount,ee.numClippingPlanes=V.numClippingPlanes,ee.numIntersection=V.numClipIntersection,ee.vertexAlphas=V.vertexAlphas,ee.vertexTangents=V.vertexTangents,ee.toneMapping=V.toneMapping}function bh(I,V,ee,te,Y){V.isScene!==!0&&(V=st),U.resetTextureUnits();const Se=V.fog,De=te.isMeshStandardMaterial?V.environment:null,He=L===null?w.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:gr,Ve=(te.isMeshStandardMaterial?j:R).get(te.envMap||De),tt=te.vertexColors===!0&&!!ee.attributes.color&&ee.attributes.color.itemSize===4,it=!!ee.attributes.tangent&&(!!te.normalMap||te.anisotropy>0),qe=!!ee.morphAttributes.position,At=!!ee.morphAttributes.normal,Ct=!!ee.morphAttributes.color;let Dt=Gi;te.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(Dt=w.toneMapping);const vt=ee.morphAttributes.position||ee.morphAttributes.normal||ee.morphAttributes.color,Ke=vt!==void 0?vt.length:0,We=Ue.get(te),Et=x.state.lights;if(ne===!0&&(de===!0||I!==X)){const In=I===X&&te.id===z;ve.setState(te,I,In)}let lt=!1;te.version===We.__version?(We.needsLights&&We.lightsStateVersion!==Et.state.version||We.outputColorSpace!==He||Y.isBatchedMesh&&We.batching===!1||!Y.isBatchedMesh&&We.batching===!0||Y.isBatchedMesh&&We.batchingColor===!0&&Y.colorTexture===null||Y.isBatchedMesh&&We.batchingColor===!1&&Y.colorTexture!==null||Y.isInstancedMesh&&We.instancing===!1||!Y.isInstancedMesh&&We.instancing===!0||Y.isSkinnedMesh&&We.skinning===!1||!Y.isSkinnedMesh&&We.skinning===!0||Y.isInstancedMesh&&We.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&We.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&We.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&We.instancingMorph===!1&&Y.morphTexture!==null||We.envMap!==Ve||te.fog===!0&&We.fog!==Se||We.numClippingPlanes!==void 0&&(We.numClippingPlanes!==ve.numPlanes||We.numIntersection!==ve.numIntersection)||We.vertexAlphas!==tt||We.vertexTangents!==it||We.morphTargets!==qe||We.morphNormals!==At||We.morphColors!==Ct||We.toneMapping!==Dt||We.morphTargetsCount!==Ke)&&(lt=!0):(lt=!0,We.__version=te.version);let rn=We.currentProgram;lt===!0&&(rn=Ns(te,V,Y));let Jn=!1,Ot=!1,vr=!1;const Ht=rn.getUniforms(),vi=We.uniforms;if(Te.useProgram(rn.program)&&(Jn=!0,Ot=!0,vr=!0),te.id!==z&&(z=te.id,Ot=!0),Jn||X!==I){ge.reverseDepthBuffer?(Me.copy(I.projectionMatrix),iM(Me),rM(Me),Ht.setValue(N,"projectionMatrix",Me)):Ht.setValue(N,"projectionMatrix",I.projectionMatrix),Ht.setValue(N,"viewMatrix",I.matrixWorldInverse);const In=Ht.map.cameraPosition;In!==void 0&&In.setValue(N,rt.setFromMatrixPosition(I.matrixWorld)),ge.logarithmicDepthBuffer&&Ht.setValue(N,"logDepthBufFC",2/(Math.log(I.far+1)/Math.LN2)),(te.isMeshPhongMaterial||te.isMeshToonMaterial||te.isMeshLambertMaterial||te.isMeshBasicMaterial||te.isMeshStandardMaterial||te.isShaderMaterial)&&Ht.setValue(N,"isOrthographic",I.isOrthographicCamera===!0),X!==I&&(X=I,Ot=!0,vr=!0)}if(Y.isSkinnedMesh){Ht.setOptional(N,Y,"bindMatrix"),Ht.setOptional(N,Y,"bindMatrixInverse");const In=Y.skeleton;In&&(In.boneTexture===null&&In.computeBoneTexture(),Ht.setValue(N,"boneTexture",In.boneTexture,U))}Y.isBatchedMesh&&(Ht.setOptional(N,Y,"batchingTexture"),Ht.setValue(N,"batchingTexture",Y._matricesTexture,U),Ht.setOptional(N,Y,"batchingIdTexture"),Ht.setValue(N,"batchingIdTexture",Y._indirectTexture,U),Ht.setOptional(N,Y,"batchingColorTexture"),Y._colorsTexture!==null&&Ht.setValue(N,"batchingColorTexture",Y._colorsTexture,U));const _r=ee.morphAttributes;if((_r.position!==void 0||_r.normal!==void 0||_r.color!==void 0)&&at.update(Y,ee,rn),(Ot||We.receiveShadow!==Y.receiveShadow)&&(We.receiveShadow=Y.receiveShadow,Ht.setValue(N,"receiveShadow",Y.receiveShadow)),te.isMeshGouraudMaterial&&te.envMap!==null&&(vi.envMap.value=Ve,vi.flipEnvMap.value=Ve.isCubeTexture&&Ve.isRenderTargetTexture===!1?-1:1),te.isMeshStandardMaterial&&te.envMap===null&&V.environment!==null&&(vi.envMapIntensity.value=V.environmentIntensity),Ot&&(Ht.setValue(N,"toneMappingExposure",w.toneMappingExposure),We.needsLights&&Ch(vi,vr),Se&&te.fog===!0&&Ce.refreshFogUniforms(vi,Se),Ce.refreshMaterialUniforms(vi,te,me,K,x.state.transmissionRenderTarget[I.id]),ru.upload(N,hl(We),vi,U)),te.isShaderMaterial&&te.uniformsNeedUpdate===!0&&(ru.upload(N,hl(We),vi,U),te.uniformsNeedUpdate=!1),te.isSpriteMaterial&&Ht.setValue(N,"center",Y.center),Ht.setValue(N,"modelViewMatrix",Y.modelViewMatrix),Ht.setValue(N,"normalMatrix",Y.normalMatrix),Ht.setValue(N,"modelMatrix",Y.matrixWorld),te.isShaderMaterial||te.isRawShaderMaterial){const In=te.uniformsGroups;for(let Ln=0,Ph=In.length;Ln<Ph;Ln++){const dl=In[Ln];H.update(dl,rn),H.bind(dl,rn)}}return rn}function Ch(I,V){I.ambientLightColor.needsUpdate=V,I.lightProbe.needsUpdate=V,I.directionalLights.needsUpdate=V,I.directionalLightShadows.needsUpdate=V,I.pointLights.needsUpdate=V,I.pointLightShadows.needsUpdate=V,I.spotLights.needsUpdate=V,I.spotLightShadows.needsUpdate=V,I.rectAreaLights.needsUpdate=V,I.hemisphereLights.needsUpdate=V}function Rh(I){return I.isMeshLambertMaterial||I.isMeshToonMaterial||I.isMeshPhongMaterial||I.isMeshStandardMaterial||I.isShadowMaterial||I.isShaderMaterial&&I.lights===!0}this.getActiveCubeFace=function(){return O},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(I,V,ee){Ue.get(I.texture).__webglTexture=V,Ue.get(I.depthTexture).__webglTexture=ee;const te=Ue.get(I);te.__hasExternalTextures=!0,te.__autoAllocateDepthBuffer=ee===void 0,te.__autoAllocateDepthBuffer||we.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),te.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(I,V){const ee=Ue.get(I);ee.__webglFramebuffer=V,ee.__useDefaultFramebuffer=V===void 0},this.setRenderTarget=function(I,V=0,ee=0){L=I,O=V,P=ee;let te=!0,Y=null,Se=!1,De=!1;if(I){const Ve=Ue.get(I);if(Ve.__useDefaultFramebuffer!==void 0)Te.bindFramebuffer(N.FRAMEBUFFER,null),te=!1;else if(Ve.__webglFramebuffer===void 0)U.setupRenderTarget(I);else if(Ve.__hasExternalTextures)U.rebindTextures(I,Ue.get(I.texture).__webglTexture,Ue.get(I.depthTexture).__webglTexture);else if(I.depthBuffer){const qe=I.depthTexture;if(Ve.__boundDepthTexture!==qe){if(qe!==null&&Ue.has(qe)&&(I.width!==qe.image.width||I.height!==qe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");U.setupDepthRenderbuffer(I)}}const tt=I.texture;(tt.isData3DTexture||tt.isDataArrayTexture||tt.isCompressedArrayTexture)&&(De=!0);const it=Ue.get(I).__webglFramebuffer;I.isWebGLCubeRenderTarget?(Array.isArray(it[V])?Y=it[V][ee]:Y=it[V],Se=!0):I.samples>0&&U.useMultisampledRTT(I)===!1?Y=Ue.get(I).__webglMultisampledFramebuffer:Array.isArray(it)?Y=it[ee]:Y=it,b.copy(I.viewport),C.copy(I.scissor),G=I.scissorTest}else b.copy(Z).multiplyScalar(me).floor(),C.copy(ie).multiplyScalar(me).floor(),G=xe;if(Te.bindFramebuffer(N.FRAMEBUFFER,Y)&&te&&Te.drawBuffers(I,Y),Te.viewport(b),Te.scissor(C),Te.setScissorTest(G),Se){const Ve=Ue.get(I.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+V,Ve.__webglTexture,ee)}else if(De){const Ve=Ue.get(I.texture),tt=V||0;N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,Ve.__webglTexture,ee||0,tt)}z=-1},this.readRenderTargetPixels=function(I,V,ee,te,Y,Se,De){if(!(I&&I.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let He=Ue.get(I).__webglFramebuffer;if(I.isWebGLCubeRenderTarget&&De!==void 0&&(He=He[De]),He){Te.bindFramebuffer(N.FRAMEBUFFER,He);try{const Ve=I.texture,tt=Ve.format,it=Ve.type;if(!ge.textureFormatReadable(tt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ge.textureTypeReadable(it)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}V>=0&&V<=I.width-te&&ee>=0&&ee<=I.height-Y&&N.readPixels(V,ee,te,Y,ct.convert(tt),ct.convert(it),Se)}finally{const Ve=L!==null?Ue.get(L).__webglFramebuffer:null;Te.bindFramebuffer(N.FRAMEBUFFER,Ve)}}},this.readRenderTargetPixelsAsync=async function(I,V,ee,te,Y,Se,De){if(!(I&&I.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let He=Ue.get(I).__webglFramebuffer;if(I.isWebGLCubeRenderTarget&&De!==void 0&&(He=He[De]),He){const Ve=I.texture,tt=Ve.format,it=Ve.type;if(!ge.textureFormatReadable(tt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ge.textureTypeReadable(it))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(V>=0&&V<=I.width-te&&ee>=0&&ee<=I.height-Y){Te.bindFramebuffer(N.FRAMEBUFFER,He);const qe=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,qe),N.bufferData(N.PIXEL_PACK_BUFFER,Se.byteLength,N.STREAM_READ),N.readPixels(V,ee,te,Y,ct.convert(tt),ct.convert(it),0);const At=L!==null?Ue.get(L).__webglFramebuffer:null;Te.bindFramebuffer(N.FRAMEBUFFER,At);const Ct=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await nM(N,Ct,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,qe),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,Se),N.deleteBuffer(qe),N.deleteSync(Ct),Se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(I,V=null,ee=0){I.isTexture!==!0&&(iu("WebGLRenderer: copyFramebufferToTexture function signature has changed."),V=arguments[0]||null,I=arguments[1]);const te=Math.pow(2,-ee),Y=Math.floor(I.image.width*te),Se=Math.floor(I.image.height*te),De=V!==null?V.x:0,He=V!==null?V.y:0;U.setTexture2D(I,0),N.copyTexSubImage2D(N.TEXTURE_2D,ee,0,0,De,He,Y,Se),Te.unbindTexture()},this.copyTextureToTexture=function(I,V,ee=null,te=null,Y=0){I.isTexture!==!0&&(iu("WebGLRenderer: copyTextureToTexture function signature has changed."),te=arguments[0]||null,I=arguments[1],V=arguments[2],Y=arguments[3]||0,ee=null);let Se,De,He,Ve,tt,it;ee!==null?(Se=ee.max.x-ee.min.x,De=ee.max.y-ee.min.y,He=ee.min.x,Ve=ee.min.y):(Se=I.image.width,De=I.image.height,He=0,Ve=0),te!==null?(tt=te.x,it=te.y):(tt=0,it=0);const qe=ct.convert(V.format),At=ct.convert(V.type);U.setTexture2D(V,0),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,V.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,V.unpackAlignment);const Ct=N.getParameter(N.UNPACK_ROW_LENGTH),Dt=N.getParameter(N.UNPACK_IMAGE_HEIGHT),vt=N.getParameter(N.UNPACK_SKIP_PIXELS),Ke=N.getParameter(N.UNPACK_SKIP_ROWS),We=N.getParameter(N.UNPACK_SKIP_IMAGES),Et=I.isCompressedTexture?I.mipmaps[Y]:I.image;N.pixelStorei(N.UNPACK_ROW_LENGTH,Et.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Et.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,He),N.pixelStorei(N.UNPACK_SKIP_ROWS,Ve),I.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,Y,tt,it,Se,De,qe,At,Et.data):I.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,Y,tt,it,Et.width,Et.height,qe,Et.data):N.texSubImage2D(N.TEXTURE_2D,Y,tt,it,Se,De,qe,At,Et),N.pixelStorei(N.UNPACK_ROW_LENGTH,Ct),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Dt),N.pixelStorei(N.UNPACK_SKIP_PIXELS,vt),N.pixelStorei(N.UNPACK_SKIP_ROWS,Ke),N.pixelStorei(N.UNPACK_SKIP_IMAGES,We),Y===0&&V.generateMipmaps&&N.generateMipmap(N.TEXTURE_2D),Te.unbindTexture()},this.copyTextureToTexture3D=function(I,V,ee=null,te=null,Y=0){I.isTexture!==!0&&(iu("WebGLRenderer: copyTextureToTexture3D function signature has changed."),ee=arguments[0]||null,te=arguments[1]||null,I=arguments[2],V=arguments[3],Y=arguments[4]||0);let Se,De,He,Ve,tt,it,qe,At,Ct;const Dt=I.isCompressedTexture?I.mipmaps[Y]:I.image;ee!==null?(Se=ee.max.x-ee.min.x,De=ee.max.y-ee.min.y,He=ee.max.z-ee.min.z,Ve=ee.min.x,tt=ee.min.y,it=ee.min.z):(Se=Dt.width,De=Dt.height,He=Dt.depth,Ve=0,tt=0,it=0),te!==null?(qe=te.x,At=te.y,Ct=te.z):(qe=0,At=0,Ct=0);const vt=ct.convert(V.format),Ke=ct.convert(V.type);let We;if(V.isData3DTexture)U.setTexture3D(V,0),We=N.TEXTURE_3D;else if(V.isDataArrayTexture||V.isCompressedArrayTexture)U.setTexture2DArray(V,0),We=N.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,V.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,V.unpackAlignment);const Et=N.getParameter(N.UNPACK_ROW_LENGTH),lt=N.getParameter(N.UNPACK_IMAGE_HEIGHT),rn=N.getParameter(N.UNPACK_SKIP_PIXELS),Jn=N.getParameter(N.UNPACK_SKIP_ROWS),Ot=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,Dt.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Dt.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Ve),N.pixelStorei(N.UNPACK_SKIP_ROWS,tt),N.pixelStorei(N.UNPACK_SKIP_IMAGES,it),I.isDataTexture||I.isData3DTexture?N.texSubImage3D(We,Y,qe,At,Ct,Se,De,He,vt,Ke,Dt.data):V.isCompressedArrayTexture?N.compressedTexSubImage3D(We,Y,qe,At,Ct,Se,De,He,vt,Dt.data):N.texSubImage3D(We,Y,qe,At,Ct,Se,De,He,vt,Ke,Dt),N.pixelStorei(N.UNPACK_ROW_LENGTH,Et),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,lt),N.pixelStorei(N.UNPACK_SKIP_PIXELS,rn),N.pixelStorei(N.UNPACK_SKIP_ROWS,Jn),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Ot),Y===0&&V.generateMipmaps&&N.generateMipmap(We),Te.unbindTexture()},this.initRenderTarget=function(I){Ue.get(I).__webglFramebuffer===void 0&&U.setupRenderTarget(I)},this.initTexture=function(I){I.isCubeTexture?U.setTextureCube(I,0):I.isData3DTexture?U.setTexture3D(I,0):I.isDataArrayTexture||I.isCompressedArrayTexture?U.setTexture2DArray(I,0):U.setTexture2D(I,0),Te.unbindTexture()},this.resetState=function(){O=0,P=0,L=null,Te.reset(),Ut.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Vi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===rh?"display-p3":"srgb",t.unpackColorSpace=Lt.workingColorSpace===Ka?"display-p3":"srgb"}}class ah{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ie(e),this.density=t}clone(){return new ah(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class lh{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ie(e),this.near=t,this.far=n}clone(){return new lh(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}let bp=class extends bt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ri,this.environmentIntensity=1,this.environmentRotation=new ri,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};class ch{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Oa,this.updateRanges=[],this.version=0,this.uuid=ii()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ii()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ii()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Nn=new D;class ni{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Nn.fromBufferAttribute(this,t),Nn.applyMatrix4(e),this.setXYZ(t,Nn.x,Nn.y,Nn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Nn.fromBufferAttribute(this,t),Nn.applyNormalMatrix(e),this.setXYZ(t,Nn.x,Nn.y,Nn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Nn.fromBufferAttribute(this,t),Nn.transformDirection(e),this.setXYZ(t,Nn.x,Nn.y,Nn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Fn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=dt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=dt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=dt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=dt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=dt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Fn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Fn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Fn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Fn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=dt(t,this.array),n=dt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=dt(t,this.array),n=dt(n,this.array),i=dt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=dt(t,this.array),n=dt(n,this.array),i=dt(i,this.array),s=dt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new Nt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new ni(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Cp extends Pn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ie(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let ao;const ra=new D,lo=new D,co=new D,uo=new fe,sa=new fe,G_=new et,Tc=new D,oa=new D,bc=new D,y0=new fe,hd=new fe,x0=new fe;class W_ extends bt{constructor(e=new Cp){if(super(),this.isSprite=!0,this.type="Sprite",ao===void 0){ao=new gt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new ch(t,5);ao.setIndex([0,1,2,0,2,3]),ao.setAttribute("position",new ni(n,3,0,!1)),ao.setAttribute("uv",new ni(n,2,3,!1))}this.geometry=ao,this.material=e,this.center=new fe(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),lo.setFromMatrixScale(this.matrixWorld),G_.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),co.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&lo.multiplyScalar(-co.z);const n=this.material.rotation;let i,s;n!==0&&(s=Math.cos(n),i=Math.sin(n));const l=this.center;Cc(Tc.set(-.5,-.5,0),co,l,lo,i,s),Cc(oa.set(.5,-.5,0),co,l,lo,i,s),Cc(bc.set(.5,.5,0),co,l,lo,i,s),y0.set(0,0),hd.set(1,0),x0.set(1,1);let c=e.ray.intersectTriangle(Tc,oa,bc,!1,ra);if(c===null&&(Cc(oa.set(-.5,.5,0),co,l,lo,i,s),hd.set(0,1),c=e.ray.intersectTriangle(Tc,bc,oa,!1,ra),c===null))return;const u=e.ray.origin.distanceTo(ra);u<e.near||u>e.far||t.push({distance:u,point:ra.clone(),uv:Xn.getInterpolation(ra,Tc,oa,bc,y0,hd,x0,new fe),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Cc(r,e,t,n,i,s){uo.subVectors(r,t).addScalar(.5).multiply(n),i!==void 0?(sa.x=s*uo.x-i*uo.y,sa.y=i*uo.x+s*uo.y):sa.copy(uo),r.copy(e),r.x+=sa.x,r.y+=sa.y,r.applyMatrix4(G_)}const Rc=new D,S0=new D;class X_ extends bt{constructor(){super(),this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]},isLOD:{value:!0}}),this.autoUpdate=!0}copy(e){super.copy(e,!1);const t=e.levels;for(let n=0,i=t.length;n<i;n++){const s=t[n];this.addLevel(s.object.clone(),s.distance,s.hysteresis)}return this.autoUpdate=e.autoUpdate,this}addLevel(e,t=0,n=0){t=Math.abs(t);const i=this.levels;let s;for(s=0;s<i.length&&!(t<i[s].distance);s++);return i.splice(s,0,{distance:t,hysteresis:n,object:e}),this.add(e),this}removeLevel(e){const t=this.levels;for(let n=0;n<t.length;n++)if(t[n].distance===e){const i=t.splice(n,1);return this.remove(i[0].object),!0}return!1}getCurrentLevel(){return this._currentLevel}getObjectForDistance(e){const t=this.levels;if(t.length>0){let n,i;for(n=1,i=t.length;n<i;n++){let s=t[n].distance;if(t[n].object.visible&&(s-=s*t[n].hysteresis),e<s)break}return t[n-1].object}return null}raycast(e,t){if(this.levels.length>0){Rc.setFromMatrixPosition(this.matrixWorld);const i=e.ray.origin.distanceTo(Rc);this.getObjectForDistance(i).raycast(e,t)}}update(e){const t=this.levels;if(t.length>1){Rc.setFromMatrixPosition(e.matrixWorld),S0.setFromMatrixPosition(this.matrixWorld);const n=Rc.distanceTo(S0)/e.zoom;t[0].object.visible=!0;let i,s;for(i=1,s=t.length;i<s;i++){let l=t[i].distance;if(t[i].object.visible&&(l-=l*t[i].hysteresis),n>=l)t[i-1].object.visible=!1,t[i].object.visible=!0;else break}for(this._currentLevel=i-1;i<s;i++)t[i].object.visible=!1}}toJSON(e){const t=super.toJSON(e);this.autoUpdate===!1&&(t.object.autoUpdate=!1),t.object.levels=[];const n=this.levels;for(let i=0,s=n.length;i<s;i++){const l=n[i];t.object.levels.push({object:l.object.uuid,distance:l.distance,hysteresis:l.hysteresis})}return t}}const M0=new D,w0=new yt,E0=new yt,_T=new D,A0=new et,Pc=new D,fd=new mn,T0=new et,dd=new Io;class Y_ extends Qt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Yd,this.bindMatrix=new et,this.bindMatrixInverse=new et,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new pn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Pc),this.boundingBox.expandByPoint(Pc)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new mn),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Pc),this.boundingSphere.expandByPoint(Pc)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),fd.copy(this.boundingSphere),fd.applyMatrix4(i),e.ray.intersectsSphere(fd)!==!1&&(T0.copy(i).invert(),dd.copy(e.ray).applyMatrix4(T0),!(this.boundingBox!==null&&dd.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,dd)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new yt,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Yd?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===f_?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;w0.fromBufferAttribute(i.attributes.skinIndex,e),E0.fromBufferAttribute(i.attributes.skinWeight,e),M0.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let s=0;s<4;s++){const l=E0.getComponent(s);if(l!==0){const c=w0.getComponent(s);A0.multiplyMatrices(n.bones[c].matrixWorld,n.boneInverses[c]),t.addScaledVector(_T.copy(M0).applyMatrix4(A0),l)}}return t.applyMatrix4(this.bindMatrixInverse)}}class Rp extends bt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Wi extends Jt{constructor(e=null,t=1,n=1,i,s,l,c,u,h=dn,d=dn,p,m){super(null,l,c,u,h,d,i,s,p,m),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const b0=new et,yT=new et;class uh{constructor(e=[],t=[]){this.uuid=ii(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new et)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new et;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,l=e.length;s<l;s++){const c=e[s]?e[s].matrixWorld:yT;b0.multiplyMatrices(c,t[s]),b0.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new uh(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Wi(t,e,e,Rn,Yn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const s=e.bones[n];let l=t[s];l===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),l=new Rp),this.bones.push(l),this.boneInverses.push(new et().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){const l=t[i];e.bones.push(l.uuid);const c=n[i];e.boneInverses.push(c.toArray())}return e}}class bo extends Nt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const ho=new et,C0=new et,Ic=[],R0=new pn,xT=new et,aa=new Qt,la=new mn;class q_ extends Qt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new bo(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,xT)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new pn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ho),R0.copy(e.boundingBox).applyMatrix4(ho),this.boundingBox.union(R0)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new mn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ho),la.copy(e.boundingSphere).applyMatrix4(ho),this.boundingSphere.union(la)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,l=e*s+1;for(let c=0;c<n.length;c++)n[c]=i[l+c]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(aa.geometry=this.geometry,aa.material=this.material,aa.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),la.copy(this.boundingSphere),la.applyMatrix4(n),e.ray.intersectsSphere(la)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,ho),C0.multiplyMatrices(n,ho),aa.matrixWorld=C0,aa.raycast(e,Ic);for(let l=0,c=Ic.length;l<c;l++){const u=Ic[l];u.instanceId=s,u.object=this,t.push(u)}Ic.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new bo(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Wi(new Float32Array(i*this.count),i,this.count,eh,Yn));const s=this.morphTexture.source.data.data;let l=0;for(let h=0;h<n.length;h++)l+=n[h];const c=this.geometry.morphTargetsRelative?1:1-l,u=i*e;s[u]=c,s.set(n,u+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}function ST(r,e){return r.z-e.z}function MT(r,e){return e.z-r.z}class wT{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,n){const i=this.pool,s=this.list;this.index>=i.length&&i.push({start:-1,count:-1,z:-1,index:-1});const l=i[this.index];s.push(l),this.index++,l.start=e.start,l.count=e.count,l.z=t,l.index=n}reset(){this.list.length=0,this.index=0}}const Dr=new et,pd=new et,ET=new et,AT=new Ie(1,1,1),P0=new et,md=new $a,Lc=new pn,rs=new mn,ca=new D,I0=new D,TT=new D,gd=new wT,Cn=new Qt,Dc=[];function bT(r,e,t=0){const n=e.itemSize;if(r.isInterleavedBufferAttribute||r.array.constructor!==e.array.constructor){const i=r.count;for(let s=0;s<i;s++)for(let l=0;l<n;l++)e.setComponent(s+t,l,r.getComponent(s,l))}else e.array.set(r.array,t*n);e.needsUpdate=!0}class Z_ extends Qt{get maxInstanceCount(){return this._maxInstanceCount}constructor(e,t,n=t*2,i){super(new gt,i),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._drawInfo=[],this._availableInstanceIds=[],this._drawRanges=[],this._reservedRanges=[],this._bounds=[],this._maxInstanceCount=e,this._maxVertexCount=t,this._maxIndexCount=n,this._geometryInitialized=!1,this._geometryCount=0,this._multiDrawCounts=new Int32Array(e),this._multiDrawStarts=new Int32Array(e),this._multiDrawCount=0,this._multiDrawInstances=null,this._visibilityChanged=!0,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}_initMatricesTexture(){let e=Math.sqrt(this._maxInstanceCount*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4),n=new Wi(t,e,e,Rn,Yn);this._matricesTexture=n}_initIndirectTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);const t=new Uint32Array(e*e),n=new Wi(t,e,e,Ja,pr);this._indirectTexture=n}_initColorsTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);const t=new Float32Array(e*e*4).fill(1),n=new Wi(t,e,e,Rn,Yn);n.colorSpace=Lt.workingColorSpace,this._colorsTexture=n}_initializeGeometry(e){const t=this.geometry,n=this._maxVertexCount,i=this._maxIndexCount;if(this._geometryInitialized===!1){for(const s in e.attributes){const l=e.getAttribute(s),{array:c,itemSize:u,normalized:h}=l,d=new c.constructor(n*u),p=new Nt(d,u,h);t.setAttribute(s,p)}if(e.getIndex()!==null){const s=n>65535?new Uint32Array(i):new Uint16Array(i);t.setIndex(new Nt(s,1))}this._geometryInitialized=!0}}_validateGeometry(e){const t=this.geometry;if(!!e.getIndex()!=!!t.getIndex())throw new Error('BatchedMesh: All geometries must consistently have "index".');for(const n in t.attributes){if(!e.hasAttribute(n))throw new Error(`BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);const i=e.getAttribute(n),s=t.getAttribute(n);if(i.itemSize!==s.itemSize||i.normalized!==s.normalized)throw new Error("BatchedMesh: All attributes must have a consistent itemSize and normalized value.")}}setCustomSort(e){return this.customSort=e,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new pn);const e=this.boundingBox,t=this._drawInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;const s=t[n].geometryIndex;this.getMatrixAt(n,Dr),this.getBoundingBoxAt(s,Lc).applyMatrix4(Dr),e.union(Lc)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new mn);const e=this.boundingSphere,t=this._drawInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;const s=t[n].geometryIndex;this.getMatrixAt(n,Dr),this.getBoundingSphereAt(s,rs).applyMatrix4(Dr),e.union(rs)}}addInstance(e){if(this._drawInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw new Error("BatchedMesh: Maximum item count reached.");const n={visible:!0,active:!0,geometryIndex:e};let i=null;this._availableInstanceIds.length>0?(i=this._availableInstanceIds.pop(),this._drawInfo[i]=n):(i=this._drawInfo.length,this._drawInfo.push(n));const s=this._matricesTexture,l=s.image.data;ET.toArray(l,i*16),s.needsUpdate=!0;const c=this._colorsTexture;return c&&(AT.toArray(c.image.data,i*4),c.needsUpdate=!0),i}addGeometry(e,t=-1,n=-1){if(this._initializeGeometry(e),this._validateGeometry(e),this._drawInfo.length>=this._maxInstanceCount)throw new Error("BatchedMesh: Maximum item count reached.");const i={vertexStart:-1,vertexCount:-1,indexStart:-1,indexCount:-1};let s=null;const l=this._reservedRanges,c=this._drawRanges,u=this._bounds;this._geometryCount!==0&&(s=l[l.length-1]),t===-1?i.vertexCount=e.getAttribute("position").count:i.vertexCount=t,s===null?i.vertexStart=0:i.vertexStart=s.vertexStart+s.vertexCount;const h=e.getIndex(),d=h!==null;if(d&&(n===-1?i.indexCount=h.count:i.indexCount=n,s===null?i.indexStart=0:i.indexStart=s.indexStart+s.indexCount),i.indexStart!==-1&&i.indexStart+i.indexCount>this._maxIndexCount||i.vertexStart+i.vertexCount>this._maxVertexCount)throw new Error("BatchedMesh: Reserved space request exceeds the maximum buffer size.");const p=this._geometryCount;return this._geometryCount++,l.push(i),c.push({start:d?i.indexStart:i.vertexStart,count:-1}),u.push({boxInitialized:!1,box:new pn,sphereInitialized:!1,sphere:new mn}),this.setGeometryAt(p,e),p}setGeometryAt(e,t){if(e>=this._geometryCount)throw new Error("BatchedMesh: Maximum geometry count reached.");this._validateGeometry(t);const n=this.geometry,i=n.getIndex()!==null,s=n.getIndex(),l=t.getIndex(),c=this._reservedRanges[e];if(i&&l.count>c.indexCount||t.attributes.position.count>c.vertexCount)throw new Error("BatchedMesh: Reserved space not large enough for provided geometry.");const u=c.vertexStart,h=c.vertexCount;for(const g in n.attributes){const y=t.getAttribute(g),M=n.getAttribute(g);bT(y,M,u);const x=y.itemSize;for(let _=y.count,E=h;_<E;_++){const w=u+_;for(let T=0;T<x;T++)M.setComponent(w,T,0)}M.needsUpdate=!0,M.addUpdateRange(u*x,h*x)}if(i){const g=c.indexStart;for(let y=0;y<l.count;y++)s.setX(g+y,u+l.getX(y));for(let y=l.count,M=c.indexCount;y<M;y++)s.setX(g+y,u);s.needsUpdate=!0,s.addUpdateRange(g,c.indexCount)}const d=this._bounds[e];t.boundingBox!==null?(d.box.copy(t.boundingBox),d.boxInitialized=!0):d.boxInitialized=!1,t.boundingSphere!==null?(d.sphere.copy(t.boundingSphere),d.sphereInitialized=!0):d.sphereInitialized=!1;const p=this._drawRanges[e],m=t.getAttribute("position");return p.count=i?l.count:m.count,this._visibilityChanged=!0,e}deleteInstance(e){const t=this._drawInfo;return e>=t.length||t[e].active===!1?this:(t[e].active=!1,this._availableInstanceIds.push(e),this._visibilityChanged=!0,this)}getBoundingBoxAt(e,t){if(e>=this._geometryCount)return null;const n=this._bounds[e],i=n.box,s=this.geometry;if(n.boxInitialized===!1){i.makeEmpty();const l=s.index,c=s.attributes.position,u=this._drawRanges[e];for(let h=u.start,d=u.start+u.count;h<d;h++){let p=h;l&&(p=l.getX(p)),i.expandByPoint(ca.fromBufferAttribute(c,p))}n.boxInitialized=!0}return t.copy(i),t}getBoundingSphereAt(e,t){if(e>=this._geometryCount)return null;const n=this._bounds[e],i=n.sphere,s=this.geometry;if(n.sphereInitialized===!1){i.makeEmpty(),this.getBoundingBoxAt(e,Lc),Lc.getCenter(i.center);const l=s.index,c=s.attributes.position,u=this._drawRanges[e];let h=0;for(let d=u.start,p=u.start+u.count;d<p;d++){let m=d;l&&(m=l.getX(m)),ca.fromBufferAttribute(c,m),h=Math.max(h,i.center.distanceToSquared(ca))}i.radius=Math.sqrt(h),n.sphereInitialized=!0}return t.copy(i),t}setMatrixAt(e,t){const n=this._drawInfo,i=this._matricesTexture,s=this._matricesTexture.image.data;return e>=n.length||n[e].active===!1?this:(t.toArray(s,e*16),i.needsUpdate=!0,this)}getMatrixAt(e,t){const n=this._drawInfo,i=this._matricesTexture.image.data;return e>=n.length||n[e].active===!1?null:t.fromArray(i,e*16)}setColorAt(e,t){this._colorsTexture===null&&this._initColorsTexture();const n=this._colorsTexture,i=this._colorsTexture.image.data,s=this._drawInfo;return e>=s.length||s[e].active===!1?this:(t.toArray(i,e*4),n.needsUpdate=!0,this)}getColorAt(e,t){const n=this._colorsTexture.image.data,i=this._drawInfo;return e>=i.length||i[e].active===!1?null:t.fromArray(n,e*4)}setVisibleAt(e,t){const n=this._drawInfo;return e>=n.length||n[e].active===!1||n[e].visible===t?this:(n[e].visible=t,this._visibilityChanged=!0,this)}getVisibleAt(e){const t=this._drawInfo;return e>=t.length||t[e].active===!1?!1:t[e].visible}setGeometryIdAt(e,t){const n=this._drawInfo;return e>=n.length||n[e].active===!1||t<0||t>=this._geometryCount?null:(n[e].geometryIndex=t,this)}getGeometryIdAt(e){const t=this._drawInfo;return e>=t.length||t[e].active===!1?-1:t[e].geometryIndex}getGeometryRangeAt(e,t={}){if(e<0||e>=this._geometryCount)return null;const n=this._drawRanges[e];return t.start=n.start,t.count=n.count,t}raycast(e,t){const n=this._drawInfo,i=this._drawRanges,s=this.matrixWorld,l=this.geometry;Cn.material=this.material,Cn.geometry.index=l.index,Cn.geometry.attributes=l.attributes,Cn.geometry.boundingBox===null&&(Cn.geometry.boundingBox=new pn),Cn.geometry.boundingSphere===null&&(Cn.geometry.boundingSphere=new mn);for(let c=0,u=n.length;c<u;c++){if(!n[c].visible||!n[c].active)continue;const h=n[c].geometryIndex,d=i[h];Cn.geometry.setDrawRange(d.start,d.count),this.getMatrixAt(c,Cn.matrixWorld).premultiply(s),this.getBoundingBoxAt(h,Cn.geometry.boundingBox),this.getBoundingSphereAt(h,Cn.geometry.boundingSphere),Cn.raycast(e,Dc);for(let p=0,m=Dc.length;p<m;p++){const g=Dc[p];g.object=this,g.batchId=c,t.push(g)}Dc.length=0}Cn.material=null,Cn.geometry.index=null,Cn.geometry.attributes={},Cn.geometry.setDrawRange(0,1/0)}copy(e){return super.copy(e),this.geometry=e.geometry.clone(),this.perObjectFrustumCulled=e.perObjectFrustumCulled,this.sortObjects=e.sortObjects,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this._drawRanges=e._drawRanges.map(t=>({...t})),this._reservedRanges=e._reservedRanges.map(t=>({...t})),this._drawInfo=e._drawInfo.map(t=>({...t})),this._bounds=e._bounds.map(t=>({boxInitialized:t.boxInitialized,box:t.box.clone(),sphereInitialized:t.sphereInitialized,sphere:t.sphere.clone()})),this._maxInstanceCount=e._maxInstanceCount,this._maxVertexCount=e._maxVertexCount,this._maxIndexCount=e._maxIndexCount,this._geometryInitialized=e._geometryInitialized,this._geometryCount=e._geometryCount,this._multiDrawCounts=e._multiDrawCounts.slice(),this._multiDrawStarts=e._multiDrawStarts.slice(),this._matricesTexture=e._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),this._colorsTexture!==null&&(this._colorsTexture=e._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()),this}dispose(){return this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null),this}onBeforeRender(e,t,n,i,s){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;const l=i.getIndex(),c=l===null?1:l.array.BYTES_PER_ELEMENT,u=this._drawInfo,h=this._multiDrawStarts,d=this._multiDrawCounts,p=this._drawRanges,m=this.perObjectFrustumCulled,g=this._indirectTexture,y=g.image.data;m&&(P0.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse).multiply(this.matrixWorld),md.setFromProjectionMatrix(P0,e.coordinateSystem));let M=0;if(this.sortObjects){pd.copy(this.matrixWorld).invert(),ca.setFromMatrixPosition(n.matrixWorld).applyMatrix4(pd),I0.set(0,0,-1).transformDirection(n.matrixWorld).transformDirection(pd);for(let E=0,w=u.length;E<w;E++)if(u[E].visible&&u[E].active){const T=u[E].geometryIndex;this.getMatrixAt(E,Dr),this.getBoundingSphereAt(T,rs).applyMatrix4(Dr);let O=!1;if(m&&(O=!md.intersectsSphere(rs)),!O){const P=TT.subVectors(rs.center,ca).dot(I0);gd.push(p[T],P,E)}}const x=gd.list,_=this.customSort;_===null?x.sort(s.transparent?MT:ST):_.call(this,x,n);for(let E=0,w=x.length;E<w;E++){const T=x[E];h[M]=T.start*c,d[M]=T.count,y[M]=T.index,M++}gd.reset()}else for(let x=0,_=u.length;x<_;x++)if(u[x].visible&&u[x].active){const E=u[x].geometryIndex;let w=!1;if(m&&(this.getMatrixAt(x,Dr),this.getBoundingSphereAt(E,rs).applyMatrix4(Dr),w=!md.intersectsSphere(rs)),!w){const T=p[E];h[M]=T.start*c,d[M]=T.count,y[M]=x,M++}}g.needsUpdate=!0,this._multiDrawCount=M,this._visibilityChanged=!1}onBeforeShadow(e,t,n,i,s,l){this.onBeforeRender(e,null,i,s,l)}}class zn extends Pn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ie(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Gu=new D,Wu=new D,L0=new et,ua=new Io,Uc=new mn,vd=new D,D0=new D;let Br=class extends bt{constructor(e=new gt,t=new zn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)Gu.fromBufferAttribute(t,i-1),Wu.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Gu.distanceTo(Wu);e.setAttribute("lineDistance",new Xe(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,l=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Uc.copy(n.boundingSphere),Uc.applyMatrix4(i),Uc.radius+=s,e.ray.intersectsSphere(Uc)===!1)return;L0.copy(i).invert(),ua.copy(e.ray).applyMatrix4(L0);const c=s/((this.scale.x+this.scale.y+this.scale.z)/3),u=c*c,h=this.isLineSegments?2:1,d=n.index,m=n.attributes.position;if(d!==null){const g=Math.max(0,l.start),y=Math.min(d.count,l.start+l.count);for(let M=g,x=y-1;M<x;M+=h){const _=d.getX(M),E=d.getX(M+1),w=Nc(this,e,ua,u,_,E);w&&t.push(w)}if(this.isLineLoop){const M=d.getX(y-1),x=d.getX(g),_=Nc(this,e,ua,u,M,x);_&&t.push(_)}}else{const g=Math.max(0,l.start),y=Math.min(m.count,l.start+l.count);for(let M=g,x=y-1;M<x;M+=h){const _=Nc(this,e,ua,u,M,M+1);_&&t.push(_)}if(this.isLineLoop){const M=Nc(this,e,ua,u,y-1,g);M&&t.push(M)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,l=i.length;s<l;s++){const c=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[c]=s}}}}};function Nc(r,e,t,n,i,s){const l=r.geometry.attributes.position;if(Gu.fromBufferAttribute(l,i),Wu.fromBufferAttribute(l,s),t.distanceSqToSegment(Gu,Wu,vd,D0)>n)return;vd.applyMatrix4(r.matrixWorld);const u=e.ray.origin.distanceTo(vd);if(!(u<e.near||u>e.far))return{distance:u,point:D0.clone().applyMatrix4(r.matrixWorld),index:i,face:null,faceIndex:null,barycoord:null,object:r}}const U0=new D,N0=new D;class qi extends Br{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)U0.fromBufferAttribute(t,i),N0.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+U0.distanceTo(N0);e.setAttribute("lineDistance",new Xe(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class J_ extends Br{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Pp extends Pn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ie(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const O0=new et,Qd=new Io,Oc=new mn,Fc=new D;class K_ extends bt{constructor(e=new gt,t=new Pp){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,l=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Oc.copy(n.boundingSphere),Oc.applyMatrix4(i),Oc.radius+=s,e.ray.intersectsSphere(Oc)===!1)return;O0.copy(i).invert(),Qd.copy(e.ray).applyMatrix4(O0);const c=s/((this.scale.x+this.scale.y+this.scale.z)/3),u=c*c,h=n.index,p=n.attributes.position;if(h!==null){const m=Math.max(0,l.start),g=Math.min(h.count,l.start+l.count);for(let y=m,M=g;y<M;y++){const x=h.getX(y);Fc.fromBufferAttribute(p,x),F0(Fc,x,u,i,e,t,this)}}else{const m=Math.max(0,l.start),g=Math.min(p.count,l.start+l.count);for(let y=m,M=g;y<M;y++)Fc.fromBufferAttribute(p,y),F0(Fc,y,u,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,l=i.length;s<l;s++){const c=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[c]=s}}}}}function F0(r,e,t,n,i,s,l){const c=Qd.distanceSqToPoint(r);if(c<t){const u=new D;Qd.closestPointToPoint(r,u),u.applyMatrix4(n);const h=i.ray.origin.distanceTo(u);if(h<i.near||h>i.far)return;s.push({distance:h,distanceToRay:Math.sqrt(c),point:u,index:e,face:null,faceIndex:null,barycoord:null,object:l})}}class CT extends Jt{constructor(e,t,n,i,s,l,c,u,h){super(e,t,n,i,s,l,c,u,h),this.isVideoTexture=!0,this.minFilter=l!==void 0?l:nn,this.magFilter=s!==void 0?s:nn,this.generateMipmaps=!1;const d=this;function p(){d.needsUpdate=!0,e.requestVideoFrameCallback(p)}"requestVideoFrameCallback"in e&&e.requestVideoFrameCallback(p)}clone(){return new this.constructor(this.image).copy(this)}update(){const e=this.image;"requestVideoFrameCallback"in e===!1&&e.readyState>=e.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}}class RT extends Jt{constructor(e,t){super({width:e,height:t}),this.isFramebufferTexture=!0,this.magFilter=dn,this.minFilter=dn,this.generateMipmaps=!1,this.needsUpdate=!0}}class hh extends Jt{constructor(e,t,n,i,s,l,c,u,h,d,p,m){super(null,l,c,u,h,d,i,s,p,m),this.isCompressedTexture=!0,this.image={width:t,height:n},this.mipmaps=e,this.flipY=!1,this.generateMipmaps=!1}}class PT extends hh{constructor(e,t,n,i,s,l){super(e,t,n,s,l),this.isCompressedArrayTexture=!0,this.image.depth=i,this.wrapR=mi,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class IT extends hh{constructor(e,t,n){super(void 0,e[0].width,e[0].height,t,n,dr),this.isCompressedCubeTexture=!0,this.isCubeTexture=!0,this.image=e}}class LT extends Jt{constructor(e,t,n,i,s,l,c,u,h){super(e,t,n,i,s,l,c,u,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class bi{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),s=0;t.push(0);for(let l=1;l<=e;l++)n=this.getPoint(l/e),s+=n.distanceTo(i),t.push(s),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let i=0;const s=n.length;let l;t?l=t:l=e*n[s-1];let c=0,u=s-1,h;for(;c<=u;)if(i=Math.floor(c+(u-c)/2),h=n[i]-l,h<0)c=i+1;else if(h>0)u=i-1;else{u=i;break}if(i=u,n[i]===l)return i/(s-1);const d=n[i],m=n[i+1]-d,g=(l-d)/m;return(i+g)/(s-1)}getTangent(e,t){let i=e-1e-4,s=e+1e-4;i<0&&(i=0),s>1&&(s=1);const l=this.getPoint(i),c=this.getPoint(s),u=t||(l.isVector2?new fe:new D);return u.copy(c).sub(l).normalize(),u}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new D,i=[],s=[],l=[],c=new D,u=new et;for(let g=0;g<=e;g++){const y=g/e;i[g]=this.getTangentAt(y,new D)}s[0]=new D,l[0]=new D;let h=Number.MAX_VALUE;const d=Math.abs(i[0].x),p=Math.abs(i[0].y),m=Math.abs(i[0].z);d<=h&&(h=d,n.set(1,0,0)),p<=h&&(h=p,n.set(0,1,0)),m<=h&&n.set(0,0,1),c.crossVectors(i[0],n).normalize(),s[0].crossVectors(i[0],c),l[0].crossVectors(i[0],s[0]);for(let g=1;g<=e;g++){if(s[g]=s[g-1].clone(),l[g]=l[g-1].clone(),c.crossVectors(i[g-1],i[g]),c.length()>Number.EPSILON){c.normalize();const y=Math.acos(Zt(i[g-1].dot(i[g]),-1,1));s[g].applyMatrix4(u.makeRotationAxis(c,y))}l[g].crossVectors(i[g],s[g])}if(t===!0){let g=Math.acos(Zt(s[0].dot(s[e]),-1,1));g/=e,i[0].dot(c.crossVectors(s[0],s[e]))>0&&(g=-g);for(let y=1;y<=e;y++)s[y].applyMatrix4(u.makeRotationAxis(i[y],g*y)),l[y].crossVectors(i[y],s[y])}return{tangents:i,normals:s,binormals:l}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class fh extends bi{constructor(e=0,t=0,n=1,i=1,s=0,l=Math.PI*2,c=!1,u=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=s,this.aEndAngle=l,this.aClockwise=c,this.aRotation=u}getPoint(e,t=new fe){const n=t,i=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const l=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=i;for(;s>i;)s-=i;s<Number.EPSILON&&(l?s=0:s=i),this.aClockwise===!0&&!l&&(s===i?s=-i:s=s-i);const c=this.aStartAngle+e*s;let u=this.aX+this.xRadius*Math.cos(c),h=this.aY+this.yRadius*Math.sin(c);if(this.aRotation!==0){const d=Math.cos(this.aRotation),p=Math.sin(this.aRotation),m=u-this.aX,g=h-this.aY;u=m*d-g*p+this.aX,h=m*p+g*d+this.aY}return n.set(u,h)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class j_ extends fh{constructor(e,t,n,i,s,l){super(e,t,n,n,i,s,l),this.isArcCurve=!0,this.type="ArcCurve"}}function Ip(){let r=0,e=0,t=0,n=0;function i(s,l,c,u){r=s,e=c,t=-3*s+3*l-2*c-u,n=2*s-2*l+c+u}return{initCatmullRom:function(s,l,c,u,h){i(l,c,h*(c-s),h*(u-l))},initNonuniformCatmullRom:function(s,l,c,u,h,d,p){let m=(l-s)/h-(c-s)/(h+d)+(c-l)/d,g=(c-l)/d-(u-l)/(d+p)+(u-c)/p;m*=d,g*=d,i(l,c,m,g)},calc:function(s){const l=s*s,c=l*s;return r+e*s+t*l+n*c}}}const Bc=new D,_d=new Ip,yd=new Ip,xd=new Ip;class Q_ extends bi{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new D){const n=t,i=this.points,s=i.length,l=(s-(this.closed?0:1))*e;let c=Math.floor(l),u=l-c;this.closed?c+=c>0?0:(Math.floor(Math.abs(c)/s)+1)*s:u===0&&c===s-1&&(c=s-2,u=1);let h,d;this.closed||c>0?h=i[(c-1)%s]:(Bc.subVectors(i[0],i[1]).add(i[0]),h=Bc);const p=i[c%s],m=i[(c+1)%s];if(this.closed||c+2<s?d=i[(c+2)%s]:(Bc.subVectors(i[s-1],i[s-2]).add(i[s-1]),d=Bc),this.curveType==="centripetal"||this.curveType==="chordal"){const g=this.curveType==="chordal"?.5:.25;let y=Math.pow(h.distanceToSquared(p),g),M=Math.pow(p.distanceToSquared(m),g),x=Math.pow(m.distanceToSquared(d),g);M<1e-4&&(M=1),y<1e-4&&(y=M),x<1e-4&&(x=M),_d.initNonuniformCatmullRom(h.x,p.x,m.x,d.x,y,M,x),yd.initNonuniformCatmullRom(h.y,p.y,m.y,d.y,y,M,x),xd.initNonuniformCatmullRom(h.z,p.z,m.z,d.z,y,M,x)}else this.curveType==="catmullrom"&&(_d.initCatmullRom(h.x,p.x,m.x,d.x,this.tension),yd.initCatmullRom(h.y,p.y,m.y,d.y,this.tension),xd.initCatmullRom(h.z,p.z,m.z,d.z,this.tension));return n.set(_d.calc(u),yd.calc(u),xd.calc(u)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new D().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function B0(r,e,t,n,i){const s=(n-e)*.5,l=(i-t)*.5,c=r*r,u=r*c;return(2*t-2*n+s+l)*u+(-3*t+3*n-2*s-l)*c+s*r+t}function DT(r,e){const t=1-r;return t*t*e}function UT(r,e){return 2*(1-r)*r*e}function NT(r,e){return r*r*e}function Aa(r,e,t,n){return DT(r,e)+UT(r,t)+NT(r,n)}function OT(r,e){const t=1-r;return t*t*t*e}function FT(r,e){const t=1-r;return 3*t*t*r*e}function BT(r,e){return 3*(1-r)*r*r*e}function zT(r,e){return r*r*r*e}function Ta(r,e,t,n,i){return OT(r,e)+FT(r,t)+BT(r,n)+zT(r,i)}class Lp extends bi{constructor(e=new fe,t=new fe,n=new fe,i=new fe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new fe){const n=t,i=this.v0,s=this.v1,l=this.v2,c=this.v3;return n.set(Ta(e,i.x,s.x,l.x,c.x),Ta(e,i.y,s.y,l.y,c.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class $_ extends bi{constructor(e=new D,t=new D,n=new D,i=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new D){const n=t,i=this.v0,s=this.v1,l=this.v2,c=this.v3;return n.set(Ta(e,i.x,s.x,l.x,c.x),Ta(e,i.y,s.y,l.y,c.y),Ta(e,i.z,s.z,l.z,c.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Dp extends bi{constructor(e=new fe,t=new fe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new fe){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new fe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ey extends bi{constructor(e=new D,t=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new D){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new D){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Up extends bi{constructor(e=new fe,t=new fe,n=new fe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new fe){const n=t,i=this.v0,s=this.v1,l=this.v2;return n.set(Aa(e,i.x,s.x,l.x),Aa(e,i.y,s.y,l.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Np extends bi{constructor(e=new D,t=new D,n=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new D){const n=t,i=this.v0,s=this.v1,l=this.v2;return n.set(Aa(e,i.x,s.x,l.x),Aa(e,i.y,s.y,l.y),Aa(e,i.z,s.z,l.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Op extends bi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new fe){const n=t,i=this.points,s=(i.length-1)*e,l=Math.floor(s),c=s-l,u=i[l===0?l:l-1],h=i[l],d=i[l>i.length-2?i.length-1:l+1],p=i[l>i.length-3?i.length-1:l+2];return n.set(B0(c,u.x,h.x,d.x,p.x),B0(c,u.y,h.y,d.y,p.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new fe().fromArray(i))}return this}}var Xu=Object.freeze({__proto__:null,ArcCurve:j_,CatmullRomCurve3:Q_,CubicBezierCurve:Lp,CubicBezierCurve3:$_,EllipseCurve:fh,LineCurve:Dp,LineCurve3:ey,QuadraticBezierCurve:Up,QuadraticBezierCurve3:Np,SplineCurve:Op});class ty extends bi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Xu[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),i=this.getCurveLengths();let s=0;for(;s<i.length;){if(i[s]>=n){const l=i[s]-n,c=this.curves[s],u=c.getLength(),h=u===0?0:1-l/u;return c.getPointAt(h,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let i=0,s=this.curves;i<s.length;i++){const l=s[i],c=l.isEllipseCurve?e*2:l.isLineCurve||l.isLineCurve3?1:l.isSplineCurve?e*l.points.length:e,u=l.getPoints(c);for(let h=0;h<u.length;h++){const d=u[h];n&&n.equals(d)||(t.push(d),n=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(new Xu[i.type]().fromJSON(i))}return this}}class za extends ty{constructor(e){super(),this.type="Path",this.currentPoint=new fe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Dp(this.currentPoint.clone(),new fe(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){const s=new Up(this.currentPoint.clone(),new fe(e,t),new fe(n,i));return this.curves.push(s),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,s,l){const c=new Lp(this.currentPoint.clone(),new fe(e,t),new fe(n,i),new fe(s,l));return this.curves.push(c),this.currentPoint.set(s,l),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Op(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,s,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absarc(e+c,t+u,n,i,s,l),this}absarc(e,t,n,i,s,l){return this.absellipse(e,t,n,n,i,s,l),this}ellipse(e,t,n,i,s,l,c,u){const h=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+h,t+d,n,i,s,l,c,u),this}absellipse(e,t,n,i,s,l,c,u){const h=new fh(e,t,n,i,s,l,c,u);if(this.curves.length>0){const p=h.getPoint(0);p.equals(this.currentPoint)||this.lineTo(p.x,p.y)}this.curves.push(h);const d=h.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class tl extends gt{constructor(e=[new fe(0,-.5),new fe(.5,0),new fe(0,.5)],t=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:i},t=Math.floor(t),i=Zt(i,0,Math.PI*2);const s=[],l=[],c=[],u=[],h=[],d=1/t,p=new D,m=new fe,g=new D,y=new D,M=new D;let x=0,_=0;for(let E=0;E<=e.length-1;E++)switch(E){case 0:x=e[E+1].x-e[E].x,_=e[E+1].y-e[E].y,g.x=_*1,g.y=-x,g.z=_*0,M.copy(g),g.normalize(),u.push(g.x,g.y,g.z);break;case e.length-1:u.push(M.x,M.y,M.z);break;default:x=e[E+1].x-e[E].x,_=e[E+1].y-e[E].y,g.x=_*1,g.y=-x,g.z=_*0,y.copy(g),g.x+=M.x,g.y+=M.y,g.z+=M.z,g.normalize(),u.push(g.x,g.y,g.z),M.copy(y)}for(let E=0;E<=t;E++){const w=n+E*d*i,T=Math.sin(w),O=Math.cos(w);for(let P=0;P<=e.length-1;P++){p.x=e[P].x*T,p.y=e[P].y,p.z=e[P].x*O,l.push(p.x,p.y,p.z),m.x=E/t,m.y=P/(e.length-1),c.push(m.x,m.y);const L=u[3*P+0]*T,z=u[3*P+1],X=u[3*P+0]*O;h.push(L,z,X)}}for(let E=0;E<t;E++)for(let w=0;w<e.length-1;w++){const T=w+E*e.length,O=T,P=T+e.length,L=T+e.length+1,z=T+1;s.push(O,P,z),s.push(L,z,P)}this.setIndex(s),this.setAttribute("position",new Xe(l,3)),this.setAttribute("uv",new Xe(c,2)),this.setAttribute("normal",new Xe(h,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new tl(e.points,e.segments,e.phiStart,e.phiLength)}}class dh extends tl{constructor(e=1,t=1,n=4,i=8){const s=new za;s.absarc(0,-t/2,e,Math.PI*1.5,0),s.absarc(0,t/2,e,0,Math.PI*.5),super(s.getPoints(n),i),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:n,radialSegments:i}}static fromJSON(e){return new dh(e.radius,e.length,e.capSegments,e.radialSegments)}}class ph extends gt{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);const s=[],l=[],c=[],u=[],h=new D,d=new fe;l.push(0,0,0),c.push(0,0,1),u.push(.5,.5);for(let p=0,m=3;p<=t;p++,m+=3){const g=n+p/t*i;h.x=e*Math.cos(g),h.y=e*Math.sin(g),l.push(h.x,h.y,h.z),c.push(0,0,1),d.x=(l[m]/e+1)/2,d.y=(l[m+1]/e+1)/2,u.push(d.x,d.y)}for(let p=1;p<=t;p++)s.push(p,p+1,0);this.setIndex(s),this.setAttribute("position",new Xe(l,3)),this.setAttribute("normal",new Xe(c,3)),this.setAttribute("uv",new Xe(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ph(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Do extends gt{constructor(e=1,t=1,n=1,i=32,s=1,l=!1,c=0,u=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:s,openEnded:l,thetaStart:c,thetaLength:u};const h=this;i=Math.floor(i),s=Math.floor(s);const d=[],p=[],m=[],g=[];let y=0;const M=[],x=n/2;let _=0;E(),l===!1&&(e>0&&w(!0),t>0&&w(!1)),this.setIndex(d),this.setAttribute("position",new Xe(p,3)),this.setAttribute("normal",new Xe(m,3)),this.setAttribute("uv",new Xe(g,2));function E(){const T=new D,O=new D;let P=0;const L=(t-e)/n;for(let z=0;z<=s;z++){const X=[],b=z/s,C=b*(t-e)+e;for(let G=0;G<=i;G++){const q=G/i,Q=q*u+c,ae=Math.sin(Q),K=Math.cos(Q);O.x=C*ae,O.y=-b*n+x,O.z=C*K,p.push(O.x,O.y,O.z),T.set(ae,L,K).normalize(),m.push(T.x,T.y,T.z),g.push(q,1-b),X.push(y++)}M.push(X)}for(let z=0;z<i;z++)for(let X=0;X<s;X++){const b=M[X][z],C=M[X+1][z],G=M[X+1][z+1],q=M[X][z+1];e>0&&(d.push(b,C,q),P+=3),t>0&&(d.push(C,G,q),P+=3)}h.addGroup(_,P,0),_+=P}function w(T){const O=y,P=new fe,L=new D;let z=0;const X=T===!0?e:t,b=T===!0?1:-1;for(let G=1;G<=i;G++)p.push(0,x*b,0),m.push(0,b,0),g.push(.5,.5),y++;const C=y;for(let G=0;G<=i;G++){const Q=G/i*u+c,ae=Math.cos(Q),K=Math.sin(Q);L.x=X*K,L.y=x*b,L.z=X*ae,p.push(L.x,L.y,L.z),m.push(0,b,0),P.x=ae*.5+.5,P.y=K*.5*b+.5,g.push(P.x,P.y),y++}for(let G=0;G<i;G++){const q=O+G,Q=C+G;T===!0?d.push(Q,Q+1,q):d.push(Q+1,Q,q),z+=3}h.addGroup(_,z,T===!0?1:2),_+=z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Do(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class mh extends Do{constructor(e=1,t=1,n=32,i=1,s=!1,l=0,c=Math.PI*2){super(0,e,t,n,i,s,l,c),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:l,thetaLength:c}}static fromJSON(e){return new mh(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Hr extends gt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const s=[],l=[];c(i),h(n),d(),this.setAttribute("position",new Xe(s,3)),this.setAttribute("normal",new Xe(s.slice(),3)),this.setAttribute("uv",new Xe(l,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function c(E){const w=new D,T=new D,O=new D;for(let P=0;P<t.length;P+=3)g(t[P+0],w),g(t[P+1],T),g(t[P+2],O),u(w,T,O,E)}function u(E,w,T,O){const P=O+1,L=[];for(let z=0;z<=P;z++){L[z]=[];const X=E.clone().lerp(T,z/P),b=w.clone().lerp(T,z/P),C=P-z;for(let G=0;G<=C;G++)G===0&&z===P?L[z][G]=X:L[z][G]=X.clone().lerp(b,G/C)}for(let z=0;z<P;z++)for(let X=0;X<2*(P-z)-1;X++){const b=Math.floor(X/2);X%2===0?(m(L[z][b+1]),m(L[z+1][b]),m(L[z][b])):(m(L[z][b+1]),m(L[z+1][b+1]),m(L[z+1][b]))}}function h(E){const w=new D;for(let T=0;T<s.length;T+=3)w.x=s[T+0],w.y=s[T+1],w.z=s[T+2],w.normalize().multiplyScalar(E),s[T+0]=w.x,s[T+1]=w.y,s[T+2]=w.z}function d(){const E=new D;for(let w=0;w<s.length;w+=3){E.x=s[w+0],E.y=s[w+1],E.z=s[w+2];const T=x(E)/2/Math.PI+.5,O=_(E)/Math.PI+.5;l.push(T,1-O)}y(),p()}function p(){for(let E=0;E<l.length;E+=6){const w=l[E+0],T=l[E+2],O=l[E+4],P=Math.max(w,T,O),L=Math.min(w,T,O);P>.9&&L<.1&&(w<.2&&(l[E+0]+=1),T<.2&&(l[E+2]+=1),O<.2&&(l[E+4]+=1))}}function m(E){s.push(E.x,E.y,E.z)}function g(E,w){const T=E*3;w.x=e[T+0],w.y=e[T+1],w.z=e[T+2]}function y(){const E=new D,w=new D,T=new D,O=new D,P=new fe,L=new fe,z=new fe;for(let X=0,b=0;X<s.length;X+=9,b+=6){E.set(s[X+0],s[X+1],s[X+2]),w.set(s[X+3],s[X+4],s[X+5]),T.set(s[X+6],s[X+7],s[X+8]),P.set(l[b+0],l[b+1]),L.set(l[b+2],l[b+3]),z.set(l[b+4],l[b+5]),O.copy(E).add(w).add(T).divideScalar(3);const C=x(O);M(P,b+0,E,C),M(L,b+2,w,C),M(z,b+4,T,C)}}function M(E,w,T,O){O<0&&E.x===1&&(l[w]=E.x-1),T.x===0&&T.z===0&&(l[w]=O/2/Math.PI+.5)}function x(E){return Math.atan2(E.z,-E.x)}function _(E){return Math.atan2(-E.y,Math.sqrt(E.x*E.x+E.z*E.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Hr(e.vertices,e.indices,e.radius,e.details)}}class gh extends Hr{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=1/n,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],l=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,l,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new gh(e.radius,e.detail)}}const zc=new D,kc=new D,Sd=new D,Hc=new Xn;class ny extends gt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const i=Math.pow(10,4),s=Math.cos(xs*t),l=e.getIndex(),c=e.getAttribute("position"),u=l?l.count:c.count,h=[0,0,0],d=["a","b","c"],p=new Array(3),m={},g=[];for(let y=0;y<u;y+=3){l?(h[0]=l.getX(y),h[1]=l.getX(y+1),h[2]=l.getX(y+2)):(h[0]=y,h[1]=y+1,h[2]=y+2);const{a:M,b:x,c:_}=Hc;if(M.fromBufferAttribute(c,h[0]),x.fromBufferAttribute(c,h[1]),_.fromBufferAttribute(c,h[2]),Hc.getNormal(Sd),p[0]=`${Math.round(M.x*i)},${Math.round(M.y*i)},${Math.round(M.z*i)}`,p[1]=`${Math.round(x.x*i)},${Math.round(x.y*i)},${Math.round(x.z*i)}`,p[2]=`${Math.round(_.x*i)},${Math.round(_.y*i)},${Math.round(_.z*i)}`,!(p[0]===p[1]||p[1]===p[2]||p[2]===p[0]))for(let E=0;E<3;E++){const w=(E+1)%3,T=p[E],O=p[w],P=Hc[d[E]],L=Hc[d[w]],z=`${T}_${O}`,X=`${O}_${T}`;X in m&&m[X]?(Sd.dot(m[X].normal)<=s&&(g.push(P.x,P.y,P.z),g.push(L.x,L.y,L.z)),m[X]=null):z in m||(m[z]={index0:h[E],index1:h[w],normal:Sd.clone()})}}for(const y in m)if(m[y]){const{index0:M,index1:x}=m[y];zc.fromBufferAttribute(c,M),kc.fromBufferAttribute(c,x),g.push(zc.x,zc.y,zc.z),g.push(kc.x,kc.y,kc.z)}this.setAttribute("position",new Xe(g,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class Ms extends za{constructor(e){super(e),this.uuid=ii(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(new za().fromJSON(i))}return this}}const kT={triangulate:function(r,e,t=2){const n=e&&e.length,i=n?e[0]*t:r.length;let s=iy(r,0,i,t,!0);const l=[];if(!s||s.next===s.prev)return l;let c,u,h,d,p,m,g;if(n&&(s=XT(r,e,s,t)),r.length>80*t){c=h=r[0],u=d=r[1];for(let y=t;y<i;y+=t)p=r[y],m=r[y+1],p<c&&(c=p),m<u&&(u=m),p>h&&(h=p),m>d&&(d=m);g=Math.max(h-c,d-u),g=g!==0?32767/g:0}return ka(s,l,t,c,u,g,0),l}};function iy(r,e,t,n,i){let s,l;if(i===nb(r,e,t,n)>0)for(s=e;s<t;s+=n)l=z0(s,r[s],r[s+1],l);else for(s=t-n;s>=e;s-=n)l=z0(s,r[s],r[s+1],l);return l&&vh(l,l.next)&&(Va(l),l=l.next),l}function bs(r,e){if(!r)return r;e||(e=r);let t=r,n;do if(n=!1,!t.steiner&&(vh(t,t.next)||Xt(t.prev,t,t.next)===0)){if(Va(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function ka(r,e,t,n,i,s,l){if(!r)return;!l&&s&&KT(r,n,i,s);let c=r,u,h;for(;r.prev!==r.next;){if(u=r.prev,h=r.next,s?VT(r,n,i,s):HT(r)){e.push(u.i/t|0),e.push(r.i/t|0),e.push(h.i/t|0),Va(r),r=h.next,c=h.next;continue}if(r=h,r===c){l?l===1?(r=GT(bs(r),e,t),ka(r,e,t,n,i,s,2)):l===2&&WT(r,e,t,n,i,s):ka(bs(r),e,t,n,i,s,1);break}}}function HT(r){const e=r.prev,t=r,n=r.next;if(Xt(e,t,n)>=0)return!1;const i=e.x,s=t.x,l=n.x,c=e.y,u=t.y,h=n.y,d=i<s?i<l?i:l:s<l?s:l,p=c<u?c<h?c:h:u<h?u:h,m=i>s?i>l?i:l:s>l?s:l,g=c>u?c>h?c:h:u>h?u:h;let y=n.next;for(;y!==e;){if(y.x>=d&&y.x<=m&&y.y>=p&&y.y<=g&&So(i,c,s,u,l,h,y.x,y.y)&&Xt(y.prev,y,y.next)>=0)return!1;y=y.next}return!0}function VT(r,e,t,n){const i=r.prev,s=r,l=r.next;if(Xt(i,s,l)>=0)return!1;const c=i.x,u=s.x,h=l.x,d=i.y,p=s.y,m=l.y,g=c<u?c<h?c:h:u<h?u:h,y=d<p?d<m?d:m:p<m?p:m,M=c>u?c>h?c:h:u>h?u:h,x=d>p?d>m?d:m:p>m?p:m,_=$d(g,y,e,t,n),E=$d(M,x,e,t,n);let w=r.prevZ,T=r.nextZ;for(;w&&w.z>=_&&T&&T.z<=E;){if(w.x>=g&&w.x<=M&&w.y>=y&&w.y<=x&&w!==i&&w!==l&&So(c,d,u,p,h,m,w.x,w.y)&&Xt(w.prev,w,w.next)>=0||(w=w.prevZ,T.x>=g&&T.x<=M&&T.y>=y&&T.y<=x&&T!==i&&T!==l&&So(c,d,u,p,h,m,T.x,T.y)&&Xt(T.prev,T,T.next)>=0))return!1;T=T.nextZ}for(;w&&w.z>=_;){if(w.x>=g&&w.x<=M&&w.y>=y&&w.y<=x&&w!==i&&w!==l&&So(c,d,u,p,h,m,w.x,w.y)&&Xt(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;T&&T.z<=E;){if(T.x>=g&&T.x<=M&&T.y>=y&&T.y<=x&&T!==i&&T!==l&&So(c,d,u,p,h,m,T.x,T.y)&&Xt(T.prev,T,T.next)>=0)return!1;T=T.nextZ}return!0}function GT(r,e,t){let n=r;do{const i=n.prev,s=n.next.next;!vh(i,s)&&ry(i,n,n.next,s)&&Ha(i,s)&&Ha(s,i)&&(e.push(i.i/t|0),e.push(n.i/t|0),e.push(s.i/t|0),Va(n),Va(n.next),n=r=s),n=n.next}while(n!==r);return bs(n)}function WT(r,e,t,n,i,s){let l=r;do{let c=l.next.next;for(;c!==l.prev;){if(l.i!==c.i&&$T(l,c)){let u=sy(l,c);l=bs(l,l.next),u=bs(u,u.next),ka(l,e,t,n,i,s,0),ka(u,e,t,n,i,s,0);return}c=c.next}l=l.next}while(l!==r)}function XT(r,e,t,n){const i=[];let s,l,c,u,h;for(s=0,l=e.length;s<l;s++)c=e[s]*n,u=s<l-1?e[s+1]*n:r.length,h=iy(r,c,u,n,!1),h===h.next&&(h.steiner=!0),i.push(QT(h));for(i.sort(YT),s=0;s<i.length;s++)t=qT(i[s],t);return t}function YT(r,e){return r.x-e.x}function qT(r,e){const t=ZT(r,e);if(!t)return e;const n=sy(t,r);return bs(n,n.next),bs(t,t.next)}function ZT(r,e){let t=e,n=-1/0,i;const s=r.x,l=r.y;do{if(l<=t.y&&l>=t.next.y&&t.next.y!==t.y){const m=t.x+(l-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(m<=s&&m>n&&(n=m,i=t.x<t.next.x?t:t.next,m===s))return i}t=t.next}while(t!==e);if(!i)return null;const c=i,u=i.x,h=i.y;let d=1/0,p;t=i;do s>=t.x&&t.x>=u&&s!==t.x&&So(l<h?s:n,l,u,h,l<h?n:s,l,t.x,t.y)&&(p=Math.abs(l-t.y)/(s-t.x),Ha(t,r)&&(p<d||p===d&&(t.x>i.x||t.x===i.x&&JT(i,t)))&&(i=t,d=p)),t=t.next;while(t!==c);return i}function JT(r,e){return Xt(r.prev,r,e.prev)<0&&Xt(e.next,r,r.next)<0}function KT(r,e,t,n){let i=r;do i.z===0&&(i.z=$d(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==r);i.prevZ.nextZ=null,i.prevZ=null,jT(i)}function jT(r){let e,t,n,i,s,l,c,u,h=1;do{for(t=r,r=null,s=null,l=0;t;){for(l++,n=t,c=0,e=0;e<h&&(c++,n=n.nextZ,!!n);e++);for(u=h;c>0||u>0&&n;)c!==0&&(u===0||!n||t.z<=n.z)?(i=t,t=t.nextZ,c--):(i=n,n=n.nextZ,u--),s?s.nextZ=i:r=i,i.prevZ=s,s=i;t=n}s.nextZ=null,h*=2}while(l>1);return r}function $d(r,e,t,n,i){return r=(r-t)*i|0,e=(e-n)*i|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,r|e<<1}function QT(r){let e=r,t=r;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==r);return t}function So(r,e,t,n,i,s,l,c){return(i-l)*(e-c)>=(r-l)*(s-c)&&(r-l)*(n-c)>=(t-l)*(e-c)&&(t-l)*(s-c)>=(i-l)*(n-c)}function $T(r,e){return r.next.i!==e.i&&r.prev.i!==e.i&&!eb(r,e)&&(Ha(r,e)&&Ha(e,r)&&tb(r,e)&&(Xt(r.prev,r,e.prev)||Xt(r,e.prev,e))||vh(r,e)&&Xt(r.prev,r,r.next)>0&&Xt(e.prev,e,e.next)>0)}function Xt(r,e,t){return(e.y-r.y)*(t.x-e.x)-(e.x-r.x)*(t.y-e.y)}function vh(r,e){return r.x===e.x&&r.y===e.y}function ry(r,e,t,n){const i=Gc(Xt(r,e,t)),s=Gc(Xt(r,e,n)),l=Gc(Xt(t,n,r)),c=Gc(Xt(t,n,e));return!!(i!==s&&l!==c||i===0&&Vc(r,t,e)||s===0&&Vc(r,n,e)||l===0&&Vc(t,r,n)||c===0&&Vc(t,e,n))}function Vc(r,e,t){return e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y)}function Gc(r){return r>0?1:r<0?-1:0}function eb(r,e){let t=r;do{if(t.i!==r.i&&t.next.i!==r.i&&t.i!==e.i&&t.next.i!==e.i&&ry(t,t.next,r,e))return!0;t=t.next}while(t!==r);return!1}function Ha(r,e){return Xt(r.prev,r,r.next)<0?Xt(r,e,r.next)>=0&&Xt(r,r.prev,e)>=0:Xt(r,e,r.prev)<0||Xt(r,r.next,e)<0}function tb(r,e){let t=r,n=!1;const i=(r.x+e.x)/2,s=(r.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&i<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==r);return n}function sy(r,e){const t=new ep(r.i,r.x,r.y),n=new ep(e.i,e.x,e.y),i=r.next,s=e.prev;return r.next=e,e.prev=r,t.next=i,i.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function z0(r,e,t,n){const i=new ep(r,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Va(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function ep(r,e,t){this.i=r,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function nb(r,e,t,n){let i=0;for(let s=e,l=t-n;s<t;s+=n)i+=(r[l]-r[s])*(r[s+1]+r[l+1]),l=s;return i}class Xi{static area(e){const t=e.length;let n=0;for(let i=t-1,s=0;s<t;i=s++)n+=e[i].x*e[s].y-e[s].x*e[i].y;return n*.5}static isClockWise(e){return Xi.area(e)<0}static triangulateShape(e,t){const n=[],i=[],s=[];k0(e),H0(n,e);let l=e.length;t.forEach(k0);for(let u=0;u<t.length;u++)i.push(l),l+=t[u].length,H0(n,t[u]);const c=kT.triangulate(n,i);for(let u=0;u<c.length;u+=3)s.push(c.slice(u,u+3));return s}}function k0(r){const e=r.length;e>2&&r[e-1].equals(r[0])&&r.pop()}function H0(r,e){for(let t=0;t<e.length;t++)r.push(e[t].x),r.push(e[t].y)}class _h extends gt{constructor(e=new Ms([new fe(.5,.5),new fe(-.5,.5),new fe(-.5,-.5),new fe(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,i=[],s=[];for(let c=0,u=e.length;c<u;c++){const h=e[c];l(h)}this.setAttribute("position",new Xe(i,3)),this.setAttribute("uv",new Xe(s,2)),this.computeVertexNormals();function l(c){const u=[],h=t.curveSegments!==void 0?t.curveSegments:12,d=t.steps!==void 0?t.steps:1,p=t.depth!==void 0?t.depth:1;let m=t.bevelEnabled!==void 0?t.bevelEnabled:!0,g=t.bevelThickness!==void 0?t.bevelThickness:.2,y=t.bevelSize!==void 0?t.bevelSize:g-.1,M=t.bevelOffset!==void 0?t.bevelOffset:0,x=t.bevelSegments!==void 0?t.bevelSegments:3;const _=t.extrudePath,E=t.UVGenerator!==void 0?t.UVGenerator:ib;let w,T=!1,O,P,L,z;_&&(w=_.getSpacedPoints(d),T=!0,m=!1,O=_.computeFrenetFrames(d,!1),P=new D,L=new D,z=new D),m||(x=0,g=0,y=0,M=0);const X=c.extractPoints(h);let b=X.shape;const C=X.holes;if(!Xi.isClockWise(b)){b=b.reverse();for(let he=0,N=C.length;he<N;he++){const Ae=C[he];Xi.isClockWise(Ae)&&(C[he]=Ae.reverse())}}const q=Xi.triangulateShape(b,C),Q=b;for(let he=0,N=C.length;he<N;he++){const Ae=C[he];b=b.concat(Ae)}function ae(he,N,Ae){return N||console.error("THREE.ExtrudeGeometry: vec does not exist"),he.clone().addScaledVector(N,Ae)}const K=b.length,me=q.length;function F(he,N,Ae){let we,ge,Te;const Je=he.x-N.x,Ue=he.y-N.y,U=Ae.x-he.x,R=Ae.y-he.y,j=Je*Je+Ue*Ue,le=Je*R-Ue*U;if(Math.abs(le)>Number.EPSILON){const ue=Math.sqrt(j),ce=Math.sqrt(U*U+R*R),Ye=N.x-Ue/ue,Ce=N.y+Je/ue,Fe=Ae.x-R/ce,xt=Ae.y+U/ce,ve=((Fe-Ye)*R-(xt-Ce)*U)/(Je*R-Ue*U);we=Ye+Je*ve-he.x,ge=Ce+Ue*ve-he.y;const Be=we*we+ge*ge;if(Be<=2)return new fe(we,ge);Te=Math.sqrt(Be/2)}else{let ue=!1;Je>Number.EPSILON?U>Number.EPSILON&&(ue=!0):Je<-Number.EPSILON?U<-Number.EPSILON&&(ue=!0):Math.sign(Ue)===Math.sign(R)&&(ue=!0),ue?(we=-Ue,ge=Je,Te=Math.sqrt(j)):(we=Je,ge=Ue,Te=Math.sqrt(j/2))}return new fe(we/Te,ge/Te)}const J=[];for(let he=0,N=Q.length,Ae=N-1,we=he+1;he<N;he++,Ae++,we++)Ae===N&&(Ae=0),we===N&&(we=0),J[he]=F(Q[he],Q[Ae],Q[we]);const Z=[];let ie,xe=J.concat();for(let he=0,N=C.length;he<N;he++){const Ae=C[he];ie=[];for(let we=0,ge=Ae.length,Te=ge-1,Je=we+1;we<ge;we++,Te++,Je++)Te===ge&&(Te=0),Je===ge&&(Je=0),ie[we]=F(Ae[we],Ae[Te],Ae[Je]);Z.push(ie),xe=xe.concat(ie)}for(let he=0;he<x;he++){const N=he/x,Ae=g*Math.cos(N*Math.PI/2),we=y*Math.sin(N*Math.PI/2)+M;for(let ge=0,Te=Q.length;ge<Te;ge++){const Je=ae(Q[ge],J[ge],we);ye(Je.x,Je.y,-Ae)}for(let ge=0,Te=C.length;ge<Te;ge++){const Je=C[ge];ie=Z[ge];for(let Ue=0,U=Je.length;Ue<U;Ue++){const R=ae(Je[Ue],ie[Ue],we);ye(R.x,R.y,-Ae)}}}const ze=y+M;for(let he=0;he<K;he++){const N=m?ae(b[he],xe[he],ze):b[he];T?(L.copy(O.normals[0]).multiplyScalar(N.x),P.copy(O.binormals[0]).multiplyScalar(N.y),z.copy(w[0]).add(L).add(P),ye(z.x,z.y,z.z)):ye(N.x,N.y,0)}for(let he=1;he<=d;he++)for(let N=0;N<K;N++){const Ae=m?ae(b[N],xe[N],ze):b[N];T?(L.copy(O.normals[he]).multiplyScalar(Ae.x),P.copy(O.binormals[he]).multiplyScalar(Ae.y),z.copy(w[he]).add(L).add(P),ye(z.x,z.y,z.z)):ye(Ae.x,Ae.y,p/d*he)}for(let he=x-1;he>=0;he--){const N=he/x,Ae=g*Math.cos(N*Math.PI/2),we=y*Math.sin(N*Math.PI/2)+M;for(let ge=0,Te=Q.length;ge<Te;ge++){const Je=ae(Q[ge],J[ge],we);ye(Je.x,Je.y,p+Ae)}for(let ge=0,Te=C.length;ge<Te;ge++){const Je=C[ge];ie=Z[ge];for(let Ue=0,U=Je.length;Ue<U;Ue++){const R=ae(Je[Ue],ie[Ue],we);T?ye(R.x,R.y+w[d-1].y,w[d-1].x+Ae):ye(R.x,R.y,p+Ae)}}}ne(),de();function ne(){const he=i.length/3;if(m){let N=0,Ae=K*N;for(let we=0;we<me;we++){const ge=q[we];rt(ge[2]+Ae,ge[1]+Ae,ge[0]+Ae)}N=d+x*2,Ae=K*N;for(let we=0;we<me;we++){const ge=q[we];rt(ge[0]+Ae,ge[1]+Ae,ge[2]+Ae)}}else{for(let N=0;N<me;N++){const Ae=q[N];rt(Ae[2],Ae[1],Ae[0])}for(let N=0;N<me;N++){const Ae=q[N];rt(Ae[0]+K*d,Ae[1]+K*d,Ae[2]+K*d)}}n.addGroup(he,i.length/3-he,0)}function de(){const he=i.length/3;let N=0;Me(Q,N),N+=Q.length;for(let Ae=0,we=C.length;Ae<we;Ae++){const ge=C[Ae];Me(ge,N),N+=ge.length}n.addGroup(he,i.length/3-he,1)}function Me(he,N){let Ae=he.length;for(;--Ae>=0;){const we=Ae;let ge=Ae-1;ge<0&&(ge=he.length-1);for(let Te=0,Je=d+x*2;Te<Je;Te++){const Ue=K*Te,U=K*(Te+1),R=N+we+Ue,j=N+ge+Ue,le=N+ge+U,ue=N+we+U;Qe(R,j,le,ue)}}}function ye(he,N,Ae){u.push(he),u.push(N),u.push(Ae)}function rt(he,N,Ae){st(he),st(N),st(Ae);const we=i.length/3,ge=E.generateTopUV(n,i,we-3,we-2,we-1);nt(ge[0]),nt(ge[1]),nt(ge[2])}function Qe(he,N,Ae,we){st(he),st(N),st(we),st(N),st(Ae),st(we);const ge=i.length/3,Te=E.generateSideWallUV(n,i,ge-6,ge-3,ge-2,ge-1);nt(Te[0]),nt(Te[1]),nt(Te[3]),nt(Te[1]),nt(Te[2]),nt(Te[3])}function st(he){i.push(u[he*3+0]),i.push(u[he*3+1]),i.push(u[he*3+2])}function nt(he){s.push(he.x),s.push(he.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return rb(t,n,e)}static fromJSON(e,t){const n=[];for(let s=0,l=e.shapes.length;s<l;s++){const c=t[e.shapes[s]];n.push(c)}const i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new Xu[i.type]().fromJSON(i)),new _h(n,e.options)}}const ib={generateTopUV:function(r,e,t,n,i){const s=e[t*3],l=e[t*3+1],c=e[n*3],u=e[n*3+1],h=e[i*3],d=e[i*3+1];return[new fe(s,l),new fe(c,u),new fe(h,d)]},generateSideWallUV:function(r,e,t,n,i,s){const l=e[t*3],c=e[t*3+1],u=e[t*3+2],h=e[n*3],d=e[n*3+1],p=e[n*3+2],m=e[i*3],g=e[i*3+1],y=e[i*3+2],M=e[s*3],x=e[s*3+1],_=e[s*3+2];return Math.abs(c-d)<Math.abs(l-h)?[new fe(l,1-u),new fe(h,1-p),new fe(m,1-y),new fe(M,1-_)]:[new fe(c,1-u),new fe(d,1-p),new fe(g,1-y),new fe(x,1-_)]}};function rb(r,e,t){if(t.shapes=[],Array.isArray(r))for(let n=0,i=r.length;n<i;n++){const s=r[n];t.shapes.push(s.uuid)}else t.shapes.push(r.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class yh extends Hr{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,s,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new yh(e.radius,e.detail)}}class nl extends Hr{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new nl(e.radius,e.detail)}}class xh extends gt{constructor(e=.5,t=1,n=32,i=1,s=0,l=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:s,thetaLength:l},n=Math.max(3,n),i=Math.max(1,i);const c=[],u=[],h=[],d=[];let p=e;const m=(t-e)/i,g=new D,y=new fe;for(let M=0;M<=i;M++){for(let x=0;x<=n;x++){const _=s+x/n*l;g.x=p*Math.cos(_),g.y=p*Math.sin(_),u.push(g.x,g.y,g.z),h.push(0,0,1),y.x=(g.x/t+1)/2,y.y=(g.y/t+1)/2,d.push(y.x,y.y)}p+=m}for(let M=0;M<i;M++){const x=M*(n+1);for(let _=0;_<n;_++){const E=_+x,w=E,T=E+n+1,O=E+n+2,P=E+1;c.push(w,T,P),c.push(T,O,P)}}this.setIndex(c),this.setAttribute("position",new Xe(u,3)),this.setAttribute("normal",new Xe(h,3)),this.setAttribute("uv",new Xe(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xh(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Sh extends gt{constructor(e=new Ms([new fe(0,.5),new fe(-.5,-.5),new fe(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],i=[],s=[],l=[];let c=0,u=0;if(Array.isArray(e)===!1)h(e);else for(let d=0;d<e.length;d++)h(e[d]),this.addGroup(c,u,d),c+=u,u=0;this.setIndex(n),this.setAttribute("position",new Xe(i,3)),this.setAttribute("normal",new Xe(s,3)),this.setAttribute("uv",new Xe(l,2));function h(d){const p=i.length/3,m=d.extractPoints(t);let g=m.shape;const y=m.holes;Xi.isClockWise(g)===!1&&(g=g.reverse());for(let x=0,_=y.length;x<_;x++){const E=y[x];Xi.isClockWise(E)===!0&&(y[x]=E.reverse())}const M=Xi.triangulateShape(g,y);for(let x=0,_=y.length;x<_;x++){const E=y[x];g=g.concat(E)}for(let x=0,_=g.length;x<_;x++){const E=g[x];i.push(E.x,E.y,0),s.push(0,0,1),l.push(E.x,E.y)}for(let x=0,_=M.length;x<_;x++){const E=M[x],w=E[0]+p,T=E[1]+p,O=E[2]+p;n.push(w,T,O),u+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return sb(t,e)}static fromJSON(e,t){const n=[];for(let i=0,s=e.shapes.length;i<s;i++){const l=t[e.shapes[i]];n.push(l)}return new Sh(n,e.curveSegments)}}function sb(r,e){if(e.shapes=[],Array.isArray(r))for(let t=0,n=r.length;t<n;t++){const i=r[t];e.shapes.push(i.uuid)}else e.shapes.push(r.uuid);return e}class il extends gt{constructor(e=1,t=32,n=16,i=0,s=Math.PI*2,l=0,c=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:l,thetaLength:c},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const u=Math.min(l+c,Math.PI);let h=0;const d=[],p=new D,m=new D,g=[],y=[],M=[],x=[];for(let _=0;_<=n;_++){const E=[],w=_/n;let T=0;_===0&&l===0?T=.5/t:_===n&&u===Math.PI&&(T=-.5/t);for(let O=0;O<=t;O++){const P=O/t;p.x=-e*Math.cos(i+P*s)*Math.sin(l+w*c),p.y=e*Math.cos(l+w*c),p.z=e*Math.sin(i+P*s)*Math.sin(l+w*c),y.push(p.x,p.y,p.z),m.copy(p).normalize(),M.push(m.x,m.y,m.z),x.push(P+T,1-w),E.push(h++)}d.push(E)}for(let _=0;_<n;_++)for(let E=0;E<t;E++){const w=d[_][E+1],T=d[_][E],O=d[_+1][E],P=d[_+1][E+1];(_!==0||l>0)&&g.push(w,T,P),(_!==n-1||u<Math.PI)&&g.push(T,O,P)}this.setIndex(g),this.setAttribute("position",new Xe(y,3)),this.setAttribute("normal",new Xe(M,3)),this.setAttribute("uv",new Xe(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new il(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Mh extends Hr{constructor(e=1,t=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Mh(e.radius,e.detail)}}class wh extends gt{constructor(e=1,t=.4,n=12,i=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:s},n=Math.floor(n),i=Math.floor(i);const l=[],c=[],u=[],h=[],d=new D,p=new D,m=new D;for(let g=0;g<=n;g++)for(let y=0;y<=i;y++){const M=y/i*s,x=g/n*Math.PI*2;p.x=(e+t*Math.cos(x))*Math.cos(M),p.y=(e+t*Math.cos(x))*Math.sin(M),p.z=t*Math.sin(x),c.push(p.x,p.y,p.z),d.x=e*Math.cos(M),d.y=e*Math.sin(M),m.subVectors(p,d).normalize(),u.push(m.x,m.y,m.z),h.push(y/i),h.push(g/n)}for(let g=1;g<=n;g++)for(let y=1;y<=i;y++){const M=(i+1)*g+y-1,x=(i+1)*(g-1)+y-1,_=(i+1)*(g-1)+y,E=(i+1)*g+y;l.push(M,x,E),l.push(x,_,E)}this.setIndex(l),this.setAttribute("position",new Xe(c,3)),this.setAttribute("normal",new Xe(u,3)),this.setAttribute("uv",new Xe(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wh(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Eh extends gt{constructor(e=1,t=.4,n=64,i=8,s=2,l=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:n,radialSegments:i,p:s,q:l},n=Math.floor(n),i=Math.floor(i);const c=[],u=[],h=[],d=[],p=new D,m=new D,g=new D,y=new D,M=new D,x=new D,_=new D;for(let w=0;w<=n;++w){const T=w/n*s*Math.PI*2;E(T,s,l,e,g),E(T+.01,s,l,e,y),x.subVectors(y,g),_.addVectors(y,g),M.crossVectors(x,_),_.crossVectors(M,x),M.normalize(),_.normalize();for(let O=0;O<=i;++O){const P=O/i*Math.PI*2,L=-t*Math.cos(P),z=t*Math.sin(P);p.x=g.x+(L*_.x+z*M.x),p.y=g.y+(L*_.y+z*M.y),p.z=g.z+(L*_.z+z*M.z),u.push(p.x,p.y,p.z),m.subVectors(p,g).normalize(),h.push(m.x,m.y,m.z),d.push(w/n),d.push(O/i)}}for(let w=1;w<=n;w++)for(let T=1;T<=i;T++){const O=(i+1)*(w-1)+(T-1),P=(i+1)*w+(T-1),L=(i+1)*w+T,z=(i+1)*(w-1)+T;c.push(O,P,z),c.push(P,L,z)}this.setIndex(c),this.setAttribute("position",new Xe(u,3)),this.setAttribute("normal",new Xe(h,3)),this.setAttribute("uv",new Xe(d,2));function E(w,T,O,P,L){const z=Math.cos(w),X=Math.sin(w),b=O/T*w,C=Math.cos(b);L.x=P*(2+C)*.5*z,L.y=P*(2+C)*X*.5,L.z=P*Math.sin(b)*.5}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Eh(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}}class Ah extends gt{constructor(e=new Np(new D(-1,-1,0),new D(-1,1,0),new D(1,1,0)),t=64,n=1,i=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:i,closed:s};const l=e.computeFrenetFrames(t,s);this.tangents=l.tangents,this.normals=l.normals,this.binormals=l.binormals;const c=new D,u=new D,h=new fe;let d=new D;const p=[],m=[],g=[],y=[];M(),this.setIndex(y),this.setAttribute("position",new Xe(p,3)),this.setAttribute("normal",new Xe(m,3)),this.setAttribute("uv",new Xe(g,2));function M(){for(let w=0;w<t;w++)x(w);x(s===!1?t:0),E(),_()}function x(w){d=e.getPointAt(w/t,d);const T=l.normals[w],O=l.binormals[w];for(let P=0;P<=i;P++){const L=P/i*Math.PI*2,z=Math.sin(L),X=-Math.cos(L);u.x=X*T.x+z*O.x,u.y=X*T.y+z*O.y,u.z=X*T.z+z*O.z,u.normalize(),m.push(u.x,u.y,u.z),c.x=d.x+n*u.x,c.y=d.y+n*u.y,c.z=d.z+n*u.z,p.push(c.x,c.y,c.z)}}function _(){for(let w=1;w<=t;w++)for(let T=1;T<=i;T++){const O=(i+1)*(w-1)+(T-1),P=(i+1)*w+(T-1),L=(i+1)*w+T,z=(i+1)*(w-1)+T;y.push(O,P,z),y.push(P,L,z)}}function E(){for(let w=0;w<=t;w++)for(let T=0;T<=i;T++)h.x=w/t,h.y=T/i,g.push(h.x,h.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new Ah(new Xu[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class Fp extends gt{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){const t=[],n=new Set,i=new D,s=new D;if(e.index!==null){const l=e.attributes.position,c=e.index;let u=e.groups;u.length===0&&(u=[{start:0,count:c.count,materialIndex:0}]);for(let h=0,d=u.length;h<d;++h){const p=u[h],m=p.start,g=p.count;for(let y=m,M=m+g;y<M;y+=3)for(let x=0;x<3;x++){const _=c.getX(y+x),E=c.getX(y+(x+1)%3);i.fromBufferAttribute(l,_),s.fromBufferAttribute(l,E),V0(i,s,n)===!0&&(t.push(i.x,i.y,i.z),t.push(s.x,s.y,s.z))}}}else{const l=e.attributes.position;for(let c=0,u=l.count/3;c<u;c++)for(let h=0;h<3;h++){const d=3*c+h,p=3*c+(h+1)%3;i.fromBufferAttribute(l,d),s.fromBufferAttribute(l,p),V0(i,s,n)===!0&&(t.push(i.x,i.y,i.z),t.push(s.x,s.y,s.z))}}this.setAttribute("position",new Xe(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}function V0(r,e,t){const n=`${r.x},${r.y},${r.z}-${e.x},${e.y},${e.z}`,i=`${e.x},${e.y},${e.z}-${r.x},${r.y},${r.z}`;return t.has(n)===!0||t.has(i)===!0?!1:(t.add(n),t.add(i),!0)}var G0=Object.freeze({__proto__:null,BoxGeometry:Cs,CapsuleGeometry:dh,CircleGeometry:ph,ConeGeometry:mh,CylinderGeometry:Do,DodecahedronGeometry:gh,EdgesGeometry:ny,ExtrudeGeometry:_h,IcosahedronGeometry:yh,LatheGeometry:tl,OctahedronGeometry:nl,PlaneGeometry:Rs,PolyhedronGeometry:Hr,RingGeometry:xh,ShapeGeometry:Sh,SphereGeometry:il,TetrahedronGeometry:Mh,TorusGeometry:wh,TorusKnotGeometry:Eh,TubeGeometry:Ah,WireframeGeometry:Fp});class oy extends Pn{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new Ie(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}}class ay extends gi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Bp extends Pn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Ie(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ie(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zr,this.normalScale=new fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ri,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class ly extends Bp{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new fe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Zt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ie(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ie(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ie(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class cy extends Pn{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new Ie(16777215),this.specular=new Ie(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ie(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zr,this.normalScale=new fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ri,this.combine=Za,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class uy extends Pn{constructor(e){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new Ie(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ie(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zr,this.normalScale=new fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}class hy extends Pn{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zr,this.normalScale=new fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}}class fy extends Pn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ie(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ie(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zr,this.normalScale=new fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ri,this.combine=Za,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class dy extends Pn{constructor(e){super(),this.isMeshMatcapMaterial=!0,this.defines={MATCAP:""},this.type="MeshMatcapMaterial",this.color=new Ie(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zr,this.normalScale=new fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={MATCAP:""},this.color.copy(e.color),this.matcap=e.matcap,this.map=e.map,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.flatShading=e.flatShading,this.fog=e.fog,this}}class py extends zn{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}function vs(r,e,t){return!r||!t&&r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function my(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function gy(r){function e(i,s){return r[i]-r[s]}const t=r.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function tp(r,e,t){const n=r.length,i=new r.constructor(n);for(let s=0,l=0;l!==n;++s){const c=t[s]*e;for(let u=0;u!==e;++u)i[l++]=r[c+u]}return i}function zp(r,e,t,n){let i=1,s=r[0];for(;s!==void 0&&s[n]===void 0;)s=r[i++];if(s===void 0)return;let l=s[n];if(l!==void 0)if(Array.isArray(l))do l=s[n],l!==void 0&&(e.push(s.time),t.push.apply(t,l)),s=r[i++];while(s!==void 0);else if(l.toArray!==void 0)do l=s[n],l!==void 0&&(e.push(s.time),l.toArray(t,t.length)),s=r[i++];while(s!==void 0);else do l=s[n],l!==void 0&&(e.push(s.time),t.push(l)),s=r[i++];while(s!==void 0)}function ob(r,e,t,n,i=30){const s=r.clone();s.name=e;const l=[];for(let u=0;u<s.tracks.length;++u){const h=s.tracks[u],d=h.getValueSize(),p=[],m=[];for(let g=0;g<h.times.length;++g){const y=h.times[g]*i;if(!(y<t||y>=n)){p.push(h.times[g]);for(let M=0;M<d;++M)m.push(h.values[g*d+M])}}p.length!==0&&(h.times=vs(p,h.times.constructor),h.values=vs(m,h.values.constructor),l.push(h))}s.tracks=l;let c=1/0;for(let u=0;u<s.tracks.length;++u)c>s.tracks[u].times[0]&&(c=s.tracks[u].times[0]);for(let u=0;u<s.tracks.length;++u)s.tracks[u].shift(-1*c);return s.resetDuration(),s}function ab(r,e=0,t=r,n=30){n<=0&&(n=30);const i=t.tracks.length,s=e/n;for(let l=0;l<i;++l){const c=t.tracks[l],u=c.ValueTypeName;if(u==="bool"||u==="string")continue;const h=r.tracks.find(function(_){return _.name===c.name&&_.ValueTypeName===u});if(h===void 0)continue;let d=0;const p=c.getValueSize();c.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(d=p/3);let m=0;const g=h.getValueSize();h.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(m=g/3);const y=c.times.length-1;let M;if(s<=c.times[0]){const _=d,E=p-d;M=c.values.slice(_,E)}else if(s>=c.times[y]){const _=y*p+d,E=_+p-d;M=c.values.slice(_,E)}else{const _=c.createInterpolant(),E=d,w=p-d;_.evaluate(s),M=_.resultBuffer.slice(E,w)}u==="quaternion"&&new qn().fromArray(M).normalize().conjugate().toArray(M);const x=h.times.length;for(let _=0;_<x;++_){const E=_*g+m;if(u==="quaternion")qn.multiplyQuaternionsFlat(h.values,E,M,0,h.values,E);else{const w=g-m*2;for(let T=0;T<w;++T)h.values[E+T]-=M[T]}}}return r.blendMode=vp,r}const lb={convertArray:vs,isTypedArray:my,getKeyframeOrder:gy,sortedArray:tp,flattenJSON:zp,subclip:ob,makeClipAdditive:ab};class rl{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],s=t[n-1];e:{t:{let l;n:{i:if(!(e<i)){for(let c=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===c)break;if(s=i,i=t[++n],e<i)break t}l=t.length;break n}if(!(e>=s)){const c=t[1];e<c&&(n=2,s=c);for(let u=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===u)break;if(i=s,s=t[--n-1],e>=s)break t}l=n,n=0;break n}break e}for(;n<l;){const c=n+l>>>1;e<t[c]?l=c:n=c+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let l=0;l!==i;++l)t[l]=n[s+l];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class vy extends rl{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ps,endingEnd:ps}}intervalChanged_(e,t,n){const i=this.parameterPositions;let s=e-2,l=e+1,c=i[s],u=i[l];if(c===void 0)switch(this.getSettings_().endingStart){case ms:s=e,c=2*t-n;break;case La:s=i.length-2,c=t+i[s]-i[s+1];break;default:s=e,c=n}if(u===void 0)switch(this.getSettings_().endingEnd){case ms:l=e,u=2*n-t;break;case La:l=1,u=n+i[1]-i[0];break;default:l=e-1,u=t}const h=(n-t)*.5,d=this.valueSize;this._weightPrev=h/(t-c),this._weightNext=h/(u-n),this._offsetPrev=s*d,this._offsetNext=l*d}interpolate_(e,t,n,i){const s=this.resultBuffer,l=this.sampleValues,c=this.valueSize,u=e*c,h=u-c,d=this._offsetPrev,p=this._offsetNext,m=this._weightPrev,g=this._weightNext,y=(n-t)/(i-t),M=y*y,x=M*y,_=-m*x+2*m*M-m*y,E=(1+m)*x+(-1.5-2*m)*M+(-.5+m)*y+1,w=(-1-g)*x+(1.5+g)*M+.5*y,T=g*x-g*M;for(let O=0;O!==c;++O)s[O]=_*l[d+O]+E*l[h+O]+w*l[u+O]+T*l[p+O];return s}}class kp extends rl{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,l=this.sampleValues,c=this.valueSize,u=e*c,h=u-c,d=(n-t)/(i-t),p=1-d;for(let m=0;m!==c;++m)s[m]=l[h+m]*p+l[u+m]*d;return s}}class _y extends rl{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class Ci{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=vs(t,this.TimeBufferType),this.values=vs(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:vs(e.times,Array),values:vs(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new _y(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new kp(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new vy(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Ia:t=this.InterpolantFactoryMethodDiscrete;break;case Hu:t=this.InterpolantFactoryMethodLinear;break;case nu:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ia;case this.InterpolantFactoryMethodLinear:return Hu;case this.InterpolantFactoryMethodSmooth:return nu}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let s=0,l=i-1;for(;s!==i&&n[s]<e;)++s;for(;l!==-1&&n[l]>t;)--l;if(++l,s!==0||l!==i){s>=l&&(l=Math.max(l,1),s=l-1);const c=this.getValueSize();this.times=n.slice(s,l),this.values=this.values.slice(s*c,l*c)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let l=null;for(let c=0;c!==s;c++){const u=n[c];if(typeof u=="number"&&isNaN(u)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,c,u),e=!1;break}if(l!==null&&l>u){console.error("THREE.KeyframeTrack: Out of order keys.",this,c,u,l),e=!1;break}l=u}if(i!==void 0&&my(i))for(let c=0,u=i.length;c!==u;++c){const h=i[c];if(isNaN(h)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,c,h),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===nu,s=e.length-1;let l=1;for(let c=1;c<s;++c){let u=!1;const h=e[c],d=e[c+1];if(h!==d&&(c!==1||h!==e[0]))if(i)u=!0;else{const p=c*n,m=p-n,g=p+n;for(let y=0;y!==n;++y){const M=t[p+y];if(M!==t[m+y]||M!==t[g+y]){u=!0;break}}}if(u){if(c!==l){e[l]=e[c];const p=c*n,m=l*n;for(let g=0;g!==n;++g)t[m+g]=t[p+g]}++l}}if(s>0){e[l]=e[s];for(let c=s*n,u=l*n,h=0;h!==n;++h)t[u+h]=t[c+h];++l}return l!==e.length?(this.times=e.slice(0,l),this.values=t.slice(0,l*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}Ci.prototype.TimeBufferType=Float32Array;Ci.prototype.ValueBufferType=Float32Array;Ci.prototype.DefaultInterpolation=Hu;class Ps extends Ci{constructor(e,t,n){super(e,t,n)}}Ps.prototype.ValueTypeName="bool";Ps.prototype.ValueBufferType=Array;Ps.prototype.DefaultInterpolation=Ia;Ps.prototype.InterpolantFactoryMethodLinear=void 0;Ps.prototype.InterpolantFactoryMethodSmooth=void 0;class Hp extends Ci{}Hp.prototype.ValueTypeName="color";class Ga extends Ci{}Ga.prototype.ValueTypeName="number";class yy extends rl{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,l=this.sampleValues,c=this.valueSize,u=(n-t)/(i-t);let h=e*c;for(let d=h+c;h!==d;h+=4)qn.slerpFlat(s,0,l,h-c,l,h,u);return s}}class sl extends Ci{InterpolantFactoryMethodLinear(e){return new yy(this.times,this.values,this.getValueSize(),e)}}sl.prototype.ValueTypeName="quaternion";sl.prototype.InterpolantFactoryMethodSmooth=void 0;class Is extends Ci{constructor(e,t,n){super(e,t,n)}}Is.prototype.ValueTypeName="string";Is.prototype.ValueBufferType=Array;Is.prototype.DefaultInterpolation=Ia;Is.prototype.InterpolantFactoryMethodLinear=void 0;Is.prototype.InterpolantFactoryMethodSmooth=void 0;class Wa extends Ci{}Wa.prototype.ValueTypeName="vector";class Xa{constructor(e="",t=-1,n=[],i=ih){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=ii(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let l=0,c=n.length;l!==c;++l)t.push(ub(n[l]).scale(i));const s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let s=0,l=n.length;s!==l;++s)t.push(Ci.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const s=t.length,l=[];for(let c=0;c<s;c++){let u=[],h=[];u.push((c+s-1)%s,c,(c+1)%s),h.push(0,1,0);const d=gy(u);u=tp(u,1,d),h=tp(h,1,d),!i&&u[0]===0&&(u.push(s),h.push(h[0])),l.push(new Ga(".morphTargetInfluences["+t[c].name+"]",u,h).scale(1/n))}return new this(e,-1,l)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},s=/^([\w-]*?)([\d]+)$/;for(let c=0,u=e.length;c<u;c++){const h=e[c],d=h.name.match(s);if(d&&d.length>1){const p=d[1];let m=i[p];m||(i[p]=m=[]),m.push(h)}}const l=[];for(const c in i)l.push(this.CreateFromMorphTargetSequence(c,i[c],t,n));return l}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(p,m,g,y,M){if(g.length!==0){const x=[],_=[];zp(g,x,_,y),x.length!==0&&M.push(new p(m,x,_))}},i=[],s=e.name||"default",l=e.fps||30,c=e.blendMode;let u=e.length||-1;const h=e.hierarchy||[];for(let p=0;p<h.length;p++){const m=h[p].keys;if(!(!m||m.length===0))if(m[0].morphTargets){const g={};let y;for(y=0;y<m.length;y++)if(m[y].morphTargets)for(let M=0;M<m[y].morphTargets.length;M++)g[m[y].morphTargets[M]]=-1;for(const M in g){const x=[],_=[];for(let E=0;E!==m[y].morphTargets.length;++E){const w=m[y];x.push(w.time),_.push(w.morphTarget===M?1:0)}i.push(new Ga(".morphTargetInfluence["+M+"]",x,_))}u=g.length*l}else{const g=".bones["+t[p].name+"]";n(Wa,g+".position",m,"pos",i),n(sl,g+".quaternion",m,"rot",i),n(Wa,g+".scale",m,"scl",i)}}return i.length===0?null:new this(s,u,i,c)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function cb(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Ga;case"vector":case"vector2":case"vector3":case"vector4":return Wa;case"color":return Hp;case"quaternion":return sl;case"bool":case"boolean":return Ps;case"string":return Is}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function ub(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=cb(r.type);if(r.times===void 0){const t=[],n=[];zp(r.keys,t,n,"value"),r.times=t,r.values=n}return e.parse!==void 0?e.parse(r):new e(r.name,r.times,r.values,r.interpolation)}const ur={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};class Vp{constructor(e,t,n){const i=this;let s=!1,l=0,c=0,u;const h=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(d){c++,s===!1&&i.onStart!==void 0&&i.onStart(d,l,c),s=!0},this.itemEnd=function(d){l++,i.onProgress!==void 0&&i.onProgress(d,l,c),l===c&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(d){i.onError!==void 0&&i.onError(d)},this.resolveURL=function(d){return u?u(d):d},this.setURLModifier=function(d){return u=d,this},this.addHandler=function(d,p){return h.push(d,p),this},this.removeHandler=function(d){const p=h.indexOf(d);return p!==-1&&h.splice(p,2),this},this.getHandler=function(d){for(let p=0,m=h.length;p<m;p+=2){const g=h[p],y=h[p+1];if(g.global&&(g.lastIndex=0),g.test(d))return y}return null}}}const xy=new Vp;class Zn{constructor(e){this.manager=e!==void 0?e:xy,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Zn.DEFAULT_MATERIAL_NAME="__DEFAULT";const or={};class hb extends Error{constructor(e,t){super(e),this.response=t}}class mr extends Zn{constructor(e){super(e)}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=ur.get(e);if(s!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0),s;if(or[e]!==void 0){or[e].push({onLoad:t,onProgress:n,onError:i});return}or[e]=[],or[e].push({onLoad:t,onProgress:n,onError:i});const l=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),c=this.mimeType,u=this.responseType;fetch(l).then(h=>{if(h.status===200||h.status===0){if(h.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||h.body===void 0||h.body.getReader===void 0)return h;const d=or[e],p=h.body.getReader(),m=h.headers.get("X-File-Size")||h.headers.get("Content-Length"),g=m?parseInt(m):0,y=g!==0;let M=0;const x=new ReadableStream({start(_){E();function E(){p.read().then(({done:w,value:T})=>{if(w)_.close();else{M+=T.byteLength;const O=new ProgressEvent("progress",{lengthComputable:y,loaded:M,total:g});for(let P=0,L=d.length;P<L;P++){const z=d[P];z.onProgress&&z.onProgress(O)}_.enqueue(T),E()}},w=>{_.error(w)})}}});return new Response(x)}else throw new hb(`fetch for "${h.url}" responded with ${h.status}: ${h.statusText}`,h)}).then(h=>{switch(u){case"arraybuffer":return h.arrayBuffer();case"blob":return h.blob();case"document":return h.text().then(d=>new DOMParser().parseFromString(d,c));case"json":return h.json();default:if(c===void 0)return h.text();{const p=/charset="?([^;"\s]*)"?/i.exec(c),m=p&&p[1]?p[1].toLowerCase():void 0,g=new TextDecoder(m);return h.arrayBuffer().then(y=>g.decode(y))}}}).then(h=>{ur.add(e,h);const d=or[e];delete or[e];for(let p=0,m=d.length;p<m;p++){const g=d[p];g.onLoad&&g.onLoad(h)}}).catch(h=>{const d=or[e];if(d===void 0)throw this.manager.itemError(e),h;delete or[e];for(let p=0,m=d.length;p<m;p++){const g=d[p];g.onError&&g.onError(h)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class fb extends Zn{constructor(e){super(e)}load(e,t,n,i){const s=this,l=new mr(this.manager);l.setPath(this.path),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{t(s.parse(JSON.parse(c)))}catch(u){i?i(u):console.error(u),s.manager.itemError(e)}},n,i)}parse(e){const t=[];for(let n=0;n<e.length;n++){const i=Xa.parse(e[n]);t.push(i)}return t}}class db extends Zn{constructor(e){super(e)}load(e,t,n,i){const s=this,l=[],c=new hh,u=new mr(this.manager);u.setPath(this.path),u.setResponseType("arraybuffer"),u.setRequestHeader(this.requestHeader),u.setWithCredentials(s.withCredentials);let h=0;function d(p){u.load(e[p],function(m){const g=s.parse(m,!0);l[p]={width:g.width,height:g.height,format:g.format,mipmaps:g.mipmaps},h+=1,h===6&&(g.mipmapCount===1&&(c.minFilter=nn),c.image=l,c.format=g.format,c.needsUpdate=!0,t&&t(c))},n,i)}if(Array.isArray(e))for(let p=0,m=e.length;p<m;++p)d(p);else u.load(e,function(p){const m=s.parse(p,!0);if(m.isCubemap){const g=m.mipmaps.length/m.mipmapCount;for(let y=0;y<g;y++){l[y]={mipmaps:[]};for(let M=0;M<m.mipmapCount;M++)l[y].mipmaps.push(m.mipmaps[y*m.mipmapCount+M]),l[y].format=m.format,l[y].width=m.width,l[y].height=m.height}c.image=l}else c.image.width=m.width,c.image.height=m.height,c.mipmaps=m.mipmaps;m.mipmapCount===1&&(c.minFilter=nn),c.format=m.format,c.needsUpdate=!0,t&&t(c)},n,i);return c}}class Ya extends Zn{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,l=ur.get(e);if(l!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(l),s.manager.itemEnd(e)},0),l;const c=Ba("img");function u(){d(),ur.add(e,this),t&&t(this),s.manager.itemEnd(e)}function h(p){d(),i&&i(p),s.manager.itemError(e),s.manager.itemEnd(e)}function d(){c.removeEventListener("load",u,!1),c.removeEventListener("error",h,!1)}return c.addEventListener("load",u,!1),c.addEventListener("error",h,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(c.crossOrigin=this.crossOrigin),s.manager.itemStart(e),c.src=e,c}}class pb extends Zn{constructor(e){super(e)}load(e,t,n,i){const s=new Qa;s.colorSpace=Wn;const l=new Ya(this.manager);l.setCrossOrigin(this.crossOrigin),l.setPath(this.path);let c=0;function u(h){l.load(e[h],function(d){s.images[h]=d,c++,c===6&&(s.needsUpdate=!0,t&&t(s))},void 0,i)}for(let h=0;h<e.length;++h)u(h);return s}}class mb extends Zn{constructor(e){super(e)}load(e,t,n,i){const s=this,l=new Wi,c=new mr(this.manager);return c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setPath(this.path),c.setWithCredentials(s.withCredentials),c.load(e,function(u){let h;try{h=s.parse(u)}catch(d){if(i!==void 0)i(d);else{console.error(d);return}}h.image!==void 0?l.image=h.image:h.data!==void 0&&(l.image.width=h.width,l.image.height=h.height,l.image.data=h.data),l.wrapS=h.wrapS!==void 0?h.wrapS:mi,l.wrapT=h.wrapT!==void 0?h.wrapT:mi,l.magFilter=h.magFilter!==void 0?h.magFilter:nn,l.minFilter=h.minFilter!==void 0?h.minFilter:nn,l.anisotropy=h.anisotropy!==void 0?h.anisotropy:1,h.colorSpace!==void 0&&(l.colorSpace=h.colorSpace),h.flipY!==void 0&&(l.flipY=h.flipY),h.format!==void 0&&(l.format=h.format),h.type!==void 0&&(l.type=h.type),h.mipmaps!==void 0&&(l.mipmaps=h.mipmaps,l.minFilter=Hi),h.mipmapCount===1&&(l.minFilter=nn),h.generateMipmaps!==void 0&&(l.generateMipmaps=h.generateMipmaps),l.needsUpdate=!0,t&&t(l,h)},n,i),l}}class gb extends Zn{constructor(e){super(e)}load(e,t,n,i){const s=new Jt,l=new Ya(this.manager);return l.setCrossOrigin(this.crossOrigin),l.setPath(this.path),l.load(e,function(c){s.image=c,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}}class Vr extends bt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ie(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Sy extends Vr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(bt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ie(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Md=new et,W0=new D,X0=new D;class Gp{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new fe(512,512),this.map=null,this.mapPass=null,this.matrix=new et,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new $a,this._frameExtents=new fe(1,1),this._viewportCount=1,this._viewports=[new yt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;W0.setFromMatrixPosition(e.matrixWorld),t.position.copy(W0),X0.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(X0),t.updateMatrixWorld(),Md.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Md),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Md)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class vb extends Gp{constructor(){super(new fn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,n=Ao*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class My extends Vr{constructor(e,t,n=0,i=Math.PI/3,s=0,l=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(bt.DEFAULT_UP),this.updateMatrix(),this.target=new bt,this.distance=n,this.angle=i,this.penumbra=s,this.decay=l,this.map=null,this.shadow=new vb}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Y0=new et,ha=new D,wd=new D;class _b extends Gp{constructor(){super(new fn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new fe(4,2),this._viewportCount=6,this._viewports=[new yt(2,1,1,1),new yt(0,1,1,1),new yt(3,1,1,1),new yt(1,1,1,1),new yt(3,0,1,1),new yt(1,0,1,1)],this._cubeDirections=[new D(1,0,0),new D(-1,0,0),new D(0,0,1),new D(0,0,-1),new D(0,1,0),new D(0,-1,0)],this._cubeUps=[new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,0,1),new D(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),ha.setFromMatrixPosition(e.matrixWorld),n.position.copy(ha),wd.copy(n.position),wd.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(wd),n.updateMatrixWorld(),i.makeTranslation(-ha.x,-ha.y,-ha.z),Y0.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Y0)}}class wy extends Vr{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new _b}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class yb extends Gp{constructor(){super(new el(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ey extends Vr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(bt.DEFAULT_UP),this.updateMatrix(),this.target=new bt,this.shadow=new yb}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Ay extends Vr{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Ty extends Vr{constructor(e,t,n=10,i=10){super(e,t),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=n,this.height=i}get power(){return this.intensity*this.width*this.height*Math.PI}set power(e){this.intensity=e/(this.width*this.height*Math.PI)}copy(e){return super.copy(e),this.width=e.width,this.height=e.height,this}toJSON(e){const t=super.toJSON(e);return t.object.width=this.width,t.object.height=this.height,t}}class by{constructor(){this.isSphericalHarmonics3=!0,this.coefficients=[];for(let e=0;e<9;e++)this.coefficients.push(new D)}set(e){for(let t=0;t<9;t++)this.coefficients[t].copy(e[t]);return this}zero(){for(let e=0;e<9;e++)this.coefficients[e].set(0,0,0);return this}getAt(e,t){const n=e.x,i=e.y,s=e.z,l=this.coefficients;return t.copy(l[0]).multiplyScalar(.282095),t.addScaledVector(l[1],.488603*i),t.addScaledVector(l[2],.488603*s),t.addScaledVector(l[3],.488603*n),t.addScaledVector(l[4],1.092548*(n*i)),t.addScaledVector(l[5],1.092548*(i*s)),t.addScaledVector(l[6],.315392*(3*s*s-1)),t.addScaledVector(l[7],1.092548*(n*s)),t.addScaledVector(l[8],.546274*(n*n-i*i)),t}getIrradianceAt(e,t){const n=e.x,i=e.y,s=e.z,l=this.coefficients;return t.copy(l[0]).multiplyScalar(.886227),t.addScaledVector(l[1],2*.511664*i),t.addScaledVector(l[2],2*.511664*s),t.addScaledVector(l[3],2*.511664*n),t.addScaledVector(l[4],2*.429043*n*i),t.addScaledVector(l[5],2*.429043*i*s),t.addScaledVector(l[6],.743125*s*s-.247708),t.addScaledVector(l[7],2*.429043*n*s),t.addScaledVector(l[8],.429043*(n*n-i*i)),t}add(e){for(let t=0;t<9;t++)this.coefficients[t].add(e.coefficients[t]);return this}addScaledSH(e,t){for(let n=0;n<9;n++)this.coefficients[n].addScaledVector(e.coefficients[n],t);return this}scale(e){for(let t=0;t<9;t++)this.coefficients[t].multiplyScalar(e);return this}lerp(e,t){for(let n=0;n<9;n++)this.coefficients[n].lerp(e.coefficients[n],t);return this}equals(e){for(let t=0;t<9;t++)if(!this.coefficients[t].equals(e.coefficients[t]))return!1;return!0}copy(e){return this.set(e.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(e,t=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].fromArray(e,t+i*3);return this}toArray(e=[],t=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].toArray(e,t+i*3);return e}static getBasisAt(e,t){const n=e.x,i=e.y,s=e.z;t[0]=.282095,t[1]=.488603*i,t[2]=.488603*s,t[3]=.488603*n,t[4]=1.092548*n*i,t[5]=1.092548*i*s,t[6]=.315392*(3*s*s-1),t[7]=1.092548*n*s,t[8]=.546274*(n*n-i*i)}}class Cy extends Vr{constructor(e=new by,t=1){super(void 0,t),this.isLightProbe=!0,this.sh=e}copy(e){return super.copy(e),this.sh.copy(e.sh),this}fromJSON(e){return this.intensity=e.intensity,this.sh.fromArray(e.sh),this}toJSON(e){const t=super.toJSON(e);return t.object.sh=this.sh.toArray(),t}}class Th extends Zn{constructor(e){super(e),this.textures={}}load(e,t,n,i){const s=this,l=new mr(s.manager);l.setPath(s.path),l.setRequestHeader(s.requestHeader),l.setWithCredentials(s.withCredentials),l.load(e,function(c){try{t(s.parse(JSON.parse(c)))}catch(u){i?i(u):console.error(u),s.manager.itemError(e)}},n,i)}parse(e){const t=this.textures;function n(s){return t[s]===void 0&&console.warn("THREE.MaterialLoader: Undefined texture",s),t[s]}const i=this.createMaterialFromType(e.type);if(e.uuid!==void 0&&(i.uuid=e.uuid),e.name!==void 0&&(i.name=e.name),e.color!==void 0&&i.color!==void 0&&i.color.setHex(e.color),e.roughness!==void 0&&(i.roughness=e.roughness),e.metalness!==void 0&&(i.metalness=e.metalness),e.sheen!==void 0&&(i.sheen=e.sheen),e.sheenColor!==void 0&&(i.sheenColor=new Ie().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(i.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&i.emissive!==void 0&&i.emissive.setHex(e.emissive),e.specular!==void 0&&i.specular!==void 0&&i.specular.setHex(e.specular),e.specularIntensity!==void 0&&(i.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&i.specularColor!==void 0&&i.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(i.shininess=e.shininess),e.clearcoat!==void 0&&(i.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(i.dispersion=e.dispersion),e.iridescence!==void 0&&(i.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(i.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(i.transmission=e.transmission),e.thickness!==void 0&&(i.thickness=e.thickness),e.attenuationDistance!==void 0&&(i.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&i.attenuationColor!==void 0&&i.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(i.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(i.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(i.fog=e.fog),e.flatShading!==void 0&&(i.flatShading=e.flatShading),e.blending!==void 0&&(i.blending=e.blending),e.combine!==void 0&&(i.combine=e.combine),e.side!==void 0&&(i.side=e.side),e.shadowSide!==void 0&&(i.shadowSide=e.shadowSide),e.opacity!==void 0&&(i.opacity=e.opacity),e.transparent!==void 0&&(i.transparent=e.transparent),e.alphaTest!==void 0&&(i.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(i.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(i.depthFunc=e.depthFunc),e.depthTest!==void 0&&(i.depthTest=e.depthTest),e.depthWrite!==void 0&&(i.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(i.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(i.blendSrc=e.blendSrc),e.blendDst!==void 0&&(i.blendDst=e.blendDst),e.blendEquation!==void 0&&(i.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(i.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(i.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(i.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&i.blendColor!==void 0&&i.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(i.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(i.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(i.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(i.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(i.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(i.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(i.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(i.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(i.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(i.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(i.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(i.rotation=e.rotation),e.linewidth!==void 0&&(i.linewidth=e.linewidth),e.dashSize!==void 0&&(i.dashSize=e.dashSize),e.gapSize!==void 0&&(i.gapSize=e.gapSize),e.scale!==void 0&&(i.scale=e.scale),e.polygonOffset!==void 0&&(i.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(i.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(i.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(i.dithering=e.dithering),e.alphaToCoverage!==void 0&&(i.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(i.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(i.forceSinglePass=e.forceSinglePass),e.visible!==void 0&&(i.visible=e.visible),e.toneMapped!==void 0&&(i.toneMapped=e.toneMapped),e.userData!==void 0&&(i.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?i.vertexColors=e.vertexColors>0:i.vertexColors=e.vertexColors),e.uniforms!==void 0)for(const s in e.uniforms){const l=e.uniforms[s];switch(i.uniforms[s]={},l.type){case"t":i.uniforms[s].value=n(l.value);break;case"c":i.uniforms[s].value=new Ie().setHex(l.value);break;case"v2":i.uniforms[s].value=new fe().fromArray(l.value);break;case"v3":i.uniforms[s].value=new D().fromArray(l.value);break;case"v4":i.uniforms[s].value=new yt().fromArray(l.value);break;case"m3":i.uniforms[s].value=new ft().fromArray(l.value);break;case"m4":i.uniforms[s].value=new et().fromArray(l.value);break;default:i.uniforms[s].value=l.value}}if(e.defines!==void 0&&(i.defines=e.defines),e.vertexShader!==void 0&&(i.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(i.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(i.glslVersion=e.glslVersion),e.extensions!==void 0)for(const s in e.extensions)i.extensions[s]=e.extensions[s];if(e.lights!==void 0&&(i.lights=e.lights),e.clipping!==void 0&&(i.clipping=e.clipping),e.size!==void 0&&(i.size=e.size),e.sizeAttenuation!==void 0&&(i.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(i.map=n(e.map)),e.matcap!==void 0&&(i.matcap=n(e.matcap)),e.alphaMap!==void 0&&(i.alphaMap=n(e.alphaMap)),e.bumpMap!==void 0&&(i.bumpMap=n(e.bumpMap)),e.bumpScale!==void 0&&(i.bumpScale=e.bumpScale),e.normalMap!==void 0&&(i.normalMap=n(e.normalMap)),e.normalMapType!==void 0&&(i.normalMapType=e.normalMapType),e.normalScale!==void 0){let s=e.normalScale;Array.isArray(s)===!1&&(s=[s,s]),i.normalScale=new fe().fromArray(s)}return e.displacementMap!==void 0&&(i.displacementMap=n(e.displacementMap)),e.displacementScale!==void 0&&(i.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(i.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(i.roughnessMap=n(e.roughnessMap)),e.metalnessMap!==void 0&&(i.metalnessMap=n(e.metalnessMap)),e.emissiveMap!==void 0&&(i.emissiveMap=n(e.emissiveMap)),e.emissiveIntensity!==void 0&&(i.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(i.specularMap=n(e.specularMap)),e.specularIntensityMap!==void 0&&(i.specularIntensityMap=n(e.specularIntensityMap)),e.specularColorMap!==void 0&&(i.specularColorMap=n(e.specularColorMap)),e.envMap!==void 0&&(i.envMap=n(e.envMap)),e.envMapRotation!==void 0&&i.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(i.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(i.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(i.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(i.lightMap=n(e.lightMap)),e.lightMapIntensity!==void 0&&(i.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(i.aoMap=n(e.aoMap)),e.aoMapIntensity!==void 0&&(i.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(i.gradientMap=n(e.gradientMap)),e.clearcoatMap!==void 0&&(i.clearcoatMap=n(e.clearcoatMap)),e.clearcoatRoughnessMap!==void 0&&(i.clearcoatRoughnessMap=n(e.clearcoatRoughnessMap)),e.clearcoatNormalMap!==void 0&&(i.clearcoatNormalMap=n(e.clearcoatNormalMap)),e.clearcoatNormalScale!==void 0&&(i.clearcoatNormalScale=new fe().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(i.iridescenceMap=n(e.iridescenceMap)),e.iridescenceThicknessMap!==void 0&&(i.iridescenceThicknessMap=n(e.iridescenceThicknessMap)),e.transmissionMap!==void 0&&(i.transmissionMap=n(e.transmissionMap)),e.thicknessMap!==void 0&&(i.thicknessMap=n(e.thicknessMap)),e.anisotropyMap!==void 0&&(i.anisotropyMap=n(e.anisotropyMap)),e.sheenColorMap!==void 0&&(i.sheenColorMap=n(e.sheenColorMap)),e.sheenRoughnessMap!==void 0&&(i.sheenRoughnessMap=n(e.sheenRoughnessMap)),i}setTextures(e){return this.textures=e,this}createMaterialFromType(e){return Th.createMaterialFromType(e)}static createMaterialFromType(e){const t={ShadowMaterial:oy,SpriteMaterial:Cp,RawShaderMaterial:ay,ShaderMaterial:gi,PointsMaterial:Pp,MeshPhysicalMaterial:ly,MeshStandardMaterial:Bp,MeshPhongMaterial:cy,MeshToonMaterial:uy,MeshNormalMaterial:hy,MeshLambertMaterial:fy,MeshDepthMaterial:Ap,MeshDistanceMaterial:Tp,MeshBasicMaterial:kr,MeshMatcapMaterial:dy,LineDashedMaterial:py,LineBasicMaterial:zn,Material:Pn};return new t[e]}}class np{static decodeText(e){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let n=0,i=e.length;n<i;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class Wp extends gt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}class Ry extends Zn{constructor(e){super(e)}load(e,t,n,i){const s=this,l=new mr(s.manager);l.setPath(s.path),l.setRequestHeader(s.requestHeader),l.setWithCredentials(s.withCredentials),l.load(e,function(c){try{t(s.parse(JSON.parse(c)))}catch(u){i?i(u):console.error(u),s.manager.itemError(e)}},n,i)}parse(e){const t={},n={};function i(g,y){if(t[y]!==void 0)return t[y];const x=g.interleavedBuffers[y],_=s(g,x.buffer),E=_o(x.type,_),w=new ch(E,x.stride);return w.uuid=x.uuid,t[y]=w,w}function s(g,y){if(n[y]!==void 0)return n[y];const x=g.arrayBuffers[y],_=new Uint32Array(x).buffer;return n[y]=_,_}const l=e.isInstancedBufferGeometry?new Wp:new gt,c=e.data.index;if(c!==void 0){const g=_o(c.type,c.array);l.setIndex(new Nt(g,1))}const u=e.data.attributes;for(const g in u){const y=u[g];let M;if(y.isInterleavedBufferAttribute){const x=i(e.data,y.data);M=new ni(x,y.itemSize,y.offset,y.normalized)}else{const x=_o(y.type,y.array),_=y.isInstancedBufferAttribute?bo:Nt;M=new _(x,y.itemSize,y.normalized)}y.name!==void 0&&(M.name=y.name),y.usage!==void 0&&M.setUsage(y.usage),l.setAttribute(g,M)}const h=e.data.morphAttributes;if(h)for(const g in h){const y=h[g],M=[];for(let x=0,_=y.length;x<_;x++){const E=y[x];let w;if(E.isInterleavedBufferAttribute){const T=i(e.data,E.data);w=new ni(T,E.itemSize,E.offset,E.normalized)}else{const T=_o(E.type,E.array);w=new Nt(T,E.itemSize,E.normalized)}E.name!==void 0&&(w.name=E.name),M.push(w)}l.morphAttributes[g]=M}e.data.morphTargetsRelative&&(l.morphTargetsRelative=!0);const p=e.data.groups||e.data.drawcalls||e.data.offsets;if(p!==void 0)for(let g=0,y=p.length;g!==y;++g){const M=p[g];l.addGroup(M.start,M.count,M.materialIndex)}const m=e.data.boundingSphere;if(m!==void 0){const g=new D;m.center!==void 0&&g.fromArray(m.center),l.boundingSphere=new mn(g,m.radius)}return e.name&&(l.name=e.name),e.userData&&(l.userData=e.userData),l}}class xb extends Zn{constructor(e){super(e)}load(e,t,n,i){const s=this,l=this.path===""?np.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||l;const c=new mr(this.manager);c.setPath(this.path),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(u){let h=null;try{h=JSON.parse(u)}catch(p){i!==void 0&&i(p),console.error("THREE:ObjectLoader: Can't parse "+e+".",p.message);return}const d=h.metadata;if(d===void 0||d.type===void 0||d.type.toLowerCase()==="geometry"){i!==void 0&&i(new Error("THREE.ObjectLoader: Can't load "+e)),console.error("THREE.ObjectLoader: Can't load "+e);return}s.parse(h,t)},n,i)}async loadAsync(e,t){const n=this,i=this.path===""?np.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||i;const s=new mr(this.manager);s.setPath(this.path),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials);const l=await s.loadAsync(e,t),c=JSON.parse(l),u=c.metadata;if(u===void 0||u.type===void 0||u.type.toLowerCase()==="geometry")throw new Error("THREE.ObjectLoader: Can't load "+e);return await n.parseAsync(c)}parse(e,t){const n=this.parseAnimations(e.animations),i=this.parseShapes(e.shapes),s=this.parseGeometries(e.geometries,i),l=this.parseImages(e.images,function(){t!==void 0&&t(h)}),c=this.parseTextures(e.textures,l),u=this.parseMaterials(e.materials,c),h=this.parseObject(e.object,s,u,c,n),d=this.parseSkeletons(e.skeletons,h);if(this.bindSkeletons(h,d),this.bindLightTargets(h),t!==void 0){let p=!1;for(const m in l)if(l[m].data instanceof HTMLImageElement){p=!0;break}p===!1&&t(h)}return h}async parseAsync(e){const t=this.parseAnimations(e.animations),n=this.parseShapes(e.shapes),i=this.parseGeometries(e.geometries,n),s=await this.parseImagesAsync(e.images),l=this.parseTextures(e.textures,s),c=this.parseMaterials(e.materials,l),u=this.parseObject(e.object,i,c,l,t),h=this.parseSkeletons(e.skeletons,u);return this.bindSkeletons(u,h),this.bindLightTargets(u),u}parseShapes(e){const t={};if(e!==void 0)for(let n=0,i=e.length;n<i;n++){const s=new Ms().fromJSON(e[n]);t[s.uuid]=s}return t}parseSkeletons(e,t){const n={},i={};if(t.traverse(function(s){s.isBone&&(i[s.uuid]=s)}),e!==void 0)for(let s=0,l=e.length;s<l;s++){const c=new uh().fromJSON(e[s],i);n[c.uuid]=c}return n}parseGeometries(e,t){const n={};if(e!==void 0){const i=new Ry;for(let s=0,l=e.length;s<l;s++){let c;const u=e[s];switch(u.type){case"BufferGeometry":case"InstancedBufferGeometry":c=i.parse(u);break;default:u.type in G0?c=G0[u.type].fromJSON(u,t):console.warn(`THREE.ObjectLoader: Unsupported geometry type "${u.type}"`)}c.uuid=u.uuid,u.name!==void 0&&(c.name=u.name),u.userData!==void 0&&(c.userData=u.userData),n[u.uuid]=c}}return n}parseMaterials(e,t){const n={},i={};if(e!==void 0){const s=new Th;s.setTextures(t);for(let l=0,c=e.length;l<c;l++){const u=e[l];n[u.uuid]===void 0&&(n[u.uuid]=s.parse(u)),i[u.uuid]=n[u.uuid]}}return i}parseAnimations(e){const t={};if(e!==void 0)for(let n=0;n<e.length;n++){const i=e[n],s=Xa.parse(i);t[s.uuid]=s}return t}parseImages(e,t){const n=this,i={};let s;function l(u){return n.manager.itemStart(u),s.load(u,function(){n.manager.itemEnd(u)},void 0,function(){n.manager.itemError(u),n.manager.itemEnd(u)})}function c(u){if(typeof u=="string"){const h=u,d=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(h)?h:n.resourcePath+h;return l(d)}else return u.data?{data:_o(u.type,u.data),width:u.width,height:u.height}:null}if(e!==void 0&&e.length>0){const u=new Vp(t);s=new Ya(u),s.setCrossOrigin(this.crossOrigin);for(let h=0,d=e.length;h<d;h++){const p=e[h],m=p.url;if(Array.isArray(m)){const g=[];for(let y=0,M=m.length;y<M;y++){const x=m[y],_=c(x);_!==null&&(_ instanceof HTMLImageElement?g.push(_):g.push(new Wi(_.data,_.width,_.height)))}i[p.uuid]=new gs(g)}else{const g=c(p.url);i[p.uuid]=new gs(g)}}}return i}async parseImagesAsync(e){const t=this,n={};let i;async function s(l){if(typeof l=="string"){const c=l,u=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(c)?c:t.resourcePath+c;return await i.loadAsync(u)}else return l.data?{data:_o(l.type,l.data),width:l.width,height:l.height}:null}if(e!==void 0&&e.length>0){i=new Ya(this.manager),i.setCrossOrigin(this.crossOrigin);for(let l=0,c=e.length;l<c;l++){const u=e[l],h=u.url;if(Array.isArray(h)){const d=[];for(let p=0,m=h.length;p<m;p++){const g=h[p],y=await s(g);y!==null&&(y instanceof HTMLImageElement?d.push(y):d.push(new Wi(y.data,y.width,y.height)))}n[u.uuid]=new gs(d)}else{const d=await s(u.url);n[u.uuid]=new gs(d)}}}return n}parseTextures(e,t){function n(s,l){return typeof s=="number"?s:(console.warn("THREE.ObjectLoader.parseTexture: Constant should be in numeric form.",s),l[s])}const i={};if(e!==void 0)for(let s=0,l=e.length;s<l;s++){const c=e[s];c.image===void 0&&console.warn('THREE.ObjectLoader: No "image" specified for',c.uuid),t[c.image]===void 0&&console.warn("THREE.ObjectLoader: Undefined image",c.image);const u=t[c.image],h=u.data;let d;Array.isArray(h)?(d=new Qa,h.length===6&&(d.needsUpdate=!0)):(h&&h.data?d=new Wi:d=new Jt,h&&(d.needsUpdate=!0)),d.source=u,d.uuid=c.uuid,c.name!==void 0&&(d.name=c.name),c.mapping!==void 0&&(d.mapping=n(c.mapping,Sb)),c.channel!==void 0&&(d.channel=c.channel),c.offset!==void 0&&d.offset.fromArray(c.offset),c.repeat!==void 0&&d.repeat.fromArray(c.repeat),c.center!==void 0&&d.center.fromArray(c.center),c.rotation!==void 0&&(d.rotation=c.rotation),c.wrap!==void 0&&(d.wrapS=n(c.wrap[0],q0),d.wrapT=n(c.wrap[1],q0)),c.format!==void 0&&(d.format=c.format),c.internalFormat!==void 0&&(d.internalFormat=c.internalFormat),c.type!==void 0&&(d.type=c.type),c.colorSpace!==void 0&&(d.colorSpace=c.colorSpace),c.minFilter!==void 0&&(d.minFilter=n(c.minFilter,Z0)),c.magFilter!==void 0&&(d.magFilter=n(c.magFilter,Z0)),c.anisotropy!==void 0&&(d.anisotropy=c.anisotropy),c.flipY!==void 0&&(d.flipY=c.flipY),c.generateMipmaps!==void 0&&(d.generateMipmaps=c.generateMipmaps),c.premultiplyAlpha!==void 0&&(d.premultiplyAlpha=c.premultiplyAlpha),c.unpackAlignment!==void 0&&(d.unpackAlignment=c.unpackAlignment),c.compareFunction!==void 0&&(d.compareFunction=c.compareFunction),c.userData!==void 0&&(d.userData=c.userData),i[c.uuid]=d}return i}parseObject(e,t,n,i,s){let l;function c(m){return t[m]===void 0&&console.warn("THREE.ObjectLoader: Undefined geometry",m),t[m]}function u(m){if(m!==void 0){if(Array.isArray(m)){const g=[];for(let y=0,M=m.length;y<M;y++){const x=m[y];n[x]===void 0&&console.warn("THREE.ObjectLoader: Undefined material",x),g.push(n[x])}return g}return n[m]===void 0&&console.warn("THREE.ObjectLoader: Undefined material",m),n[m]}}function h(m){return i[m]===void 0&&console.warn("THREE.ObjectLoader: Undefined texture",m),i[m]}let d,p;switch(e.type){case"Scene":l=new bp,e.background!==void 0&&(Number.isInteger(e.background)?l.background=new Ie(e.background):l.background=h(e.background)),e.environment!==void 0&&(l.environment=h(e.environment)),e.fog!==void 0&&(e.fog.type==="Fog"?l.fog=new lh(e.fog.color,e.fog.near,e.fog.far):e.fog.type==="FogExp2"&&(l.fog=new ah(e.fog.color,e.fog.density)),e.fog.name!==""&&(l.fog.name=e.fog.name)),e.backgroundBlurriness!==void 0&&(l.backgroundBlurriness=e.backgroundBlurriness),e.backgroundIntensity!==void 0&&(l.backgroundIntensity=e.backgroundIntensity),e.backgroundRotation!==void 0&&l.backgroundRotation.fromArray(e.backgroundRotation),e.environmentIntensity!==void 0&&(l.environmentIntensity=e.environmentIntensity),e.environmentRotation!==void 0&&l.environmentRotation.fromArray(e.environmentRotation);break;case"PerspectiveCamera":l=new fn(e.fov,e.aspect,e.near,e.far),e.focus!==void 0&&(l.focus=e.focus),e.zoom!==void 0&&(l.zoom=e.zoom),e.filmGauge!==void 0&&(l.filmGauge=e.filmGauge),e.filmOffset!==void 0&&(l.filmOffset=e.filmOffset),e.view!==void 0&&(l.view=Object.assign({},e.view));break;case"OrthographicCamera":l=new el(e.left,e.right,e.top,e.bottom,e.near,e.far),e.zoom!==void 0&&(l.zoom=e.zoom),e.view!==void 0&&(l.view=Object.assign({},e.view));break;case"AmbientLight":l=new Ay(e.color,e.intensity);break;case"DirectionalLight":l=new Ey(e.color,e.intensity),l.target=e.target||"";break;case"PointLight":l=new wy(e.color,e.intensity,e.distance,e.decay);break;case"RectAreaLight":l=new Ty(e.color,e.intensity,e.width,e.height);break;case"SpotLight":l=new My(e.color,e.intensity,e.distance,e.angle,e.penumbra,e.decay),l.target=e.target||"";break;case"HemisphereLight":l=new Sy(e.color,e.groundColor,e.intensity);break;case"LightProbe":l=new Cy().fromJSON(e);break;case"SkinnedMesh":d=c(e.geometry),p=u(e.material),l=new Y_(d,p),e.bindMode!==void 0&&(l.bindMode=e.bindMode),e.bindMatrix!==void 0&&l.bindMatrix.fromArray(e.bindMatrix),e.skeleton!==void 0&&(l.skeleton=e.skeleton);break;case"Mesh":d=c(e.geometry),p=u(e.material),l=new Qt(d,p);break;case"InstancedMesh":d=c(e.geometry),p=u(e.material);const m=e.count,g=e.instanceMatrix,y=e.instanceColor;l=new q_(d,p,m),l.instanceMatrix=new bo(new Float32Array(g.array),16),y!==void 0&&(l.instanceColor=new bo(new Float32Array(y.array),y.itemSize));break;case"BatchedMesh":d=c(e.geometry),p=u(e.material),l=new Z_(e.maxInstanceCount,e.maxVertexCount,e.maxIndexCount,p),l.geometry=d,l.perObjectFrustumCulled=e.perObjectFrustumCulled,l.sortObjects=e.sortObjects,l._drawRanges=e.drawRanges,l._reservedRanges=e.reservedRanges,l._visibility=e.visibility,l._active=e.active,l._bounds=e.bounds.map(M=>{const x=new pn;x.min.fromArray(M.boxMin),x.max.fromArray(M.boxMax);const _=new mn;return _.radius=M.sphereRadius,_.center.fromArray(M.sphereCenter),{boxInitialized:M.boxInitialized,box:x,sphereInitialized:M.sphereInitialized,sphere:_}}),l._maxInstanceCount=e.maxInstanceCount,l._maxVertexCount=e.maxVertexCount,l._maxIndexCount=e.maxIndexCount,l._geometryInitialized=e.geometryInitialized,l._geometryCount=e.geometryCount,l._matricesTexture=h(e.matricesTexture.uuid),e.colorsTexture!==void 0&&(l._colorsTexture=h(e.colorsTexture.uuid));break;case"LOD":l=new X_;break;case"Line":l=new Br(c(e.geometry),u(e.material));break;case"LineLoop":l=new J_(c(e.geometry),u(e.material));break;case"LineSegments":l=new qi(c(e.geometry),u(e.material));break;case"PointCloud":case"Points":l=new K_(c(e.geometry),u(e.material));break;case"Sprite":l=new W_(u(e.material));break;case"Group":l=new xo;break;case"Bone":l=new Rp;break;default:l=new bt}if(l.uuid=e.uuid,e.name!==void 0&&(l.name=e.name),e.matrix!==void 0?(l.matrix.fromArray(e.matrix),e.matrixAutoUpdate!==void 0&&(l.matrixAutoUpdate=e.matrixAutoUpdate),l.matrixAutoUpdate&&l.matrix.decompose(l.position,l.quaternion,l.scale)):(e.position!==void 0&&l.position.fromArray(e.position),e.rotation!==void 0&&l.rotation.fromArray(e.rotation),e.quaternion!==void 0&&l.quaternion.fromArray(e.quaternion),e.scale!==void 0&&l.scale.fromArray(e.scale)),e.up!==void 0&&l.up.fromArray(e.up),e.castShadow!==void 0&&(l.castShadow=e.castShadow),e.receiveShadow!==void 0&&(l.receiveShadow=e.receiveShadow),e.shadow&&(e.shadow.intensity!==void 0&&(l.shadow.intensity=e.shadow.intensity),e.shadow.bias!==void 0&&(l.shadow.bias=e.shadow.bias),e.shadow.normalBias!==void 0&&(l.shadow.normalBias=e.shadow.normalBias),e.shadow.radius!==void 0&&(l.shadow.radius=e.shadow.radius),e.shadow.mapSize!==void 0&&l.shadow.mapSize.fromArray(e.shadow.mapSize),e.shadow.camera!==void 0&&(l.shadow.camera=this.parseObject(e.shadow.camera))),e.visible!==void 0&&(l.visible=e.visible),e.frustumCulled!==void 0&&(l.frustumCulled=e.frustumCulled),e.renderOrder!==void 0&&(l.renderOrder=e.renderOrder),e.userData!==void 0&&(l.userData=e.userData),e.layers!==void 0&&(l.layers.mask=e.layers),e.children!==void 0){const m=e.children;for(let g=0;g<m.length;g++)l.add(this.parseObject(m[g],t,n,i,s))}if(e.animations!==void 0){const m=e.animations;for(let g=0;g<m.length;g++){const y=m[g];l.animations.push(s[y])}}if(e.type==="LOD"){e.autoUpdate!==void 0&&(l.autoUpdate=e.autoUpdate);const m=e.levels;for(let g=0;g<m.length;g++){const y=m[g],M=l.getObjectByProperty("uuid",y.object);M!==void 0&&l.addLevel(M,y.distance,y.hysteresis)}}return l}bindSkeletons(e,t){Object.keys(t).length!==0&&e.traverse(function(n){if(n.isSkinnedMesh===!0&&n.skeleton!==void 0){const i=t[n.skeleton];i===void 0?console.warn("THREE.ObjectLoader: No skeleton found with UUID:",n.skeleton):n.bind(i,n.bindMatrix)}})}bindLightTargets(e){e.traverse(function(t){if(t.isDirectionalLight||t.isSpotLight){const n=t.target,i=e.getObjectByProperty("uuid",n);i!==void 0?t.target=i:t.target=new bt}})}}const Sb={UVMapping:Ku,CubeReflectionMapping:dr,CubeRefractionMapping:Fr,EquirectangularReflectionMapping:ba,EquirectangularRefractionMapping:Ca,CubeUVReflectionMapping:Ro},q0={RepeatWrapping:Ra,ClampToEdgeWrapping:mi,MirroredRepeatWrapping:Pa},Z0={NearestFilter:dn,NearestMipmapNearestFilter:ap,NearestMipmapLinearFilter:vo,LinearFilter:nn,LinearMipmapNearestFilter:_a,LinearMipmapLinearFilter:Hi};class Mb extends Zn{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,l=ur.get(e);if(l!==void 0){if(s.manager.itemStart(e),l.then){l.then(h=>{t&&t(h),s.manager.itemEnd(e)}).catch(h=>{i&&i(h)});return}return setTimeout(function(){t&&t(l),s.manager.itemEnd(e)},0),l}const c={};c.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",c.headers=this.requestHeader;const u=fetch(e,c).then(function(h){return h.blob()}).then(function(h){return createImageBitmap(h,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(h){return ur.add(e,h),t&&t(h),s.manager.itemEnd(e),h}).catch(function(h){i&&i(h),ur.remove(e),s.manager.itemError(e),s.manager.itemEnd(e)});ur.add(e,u),s.manager.itemStart(e)}}let Wc;class Xp{static getContext(){return Wc===void 0&&(Wc=new(window.AudioContext||window.webkitAudioContext)),Wc}static setContext(e){Wc=e}}class wb extends Zn{constructor(e){super(e)}load(e,t,n,i){const s=this,l=new mr(this.manager);l.setResponseType("arraybuffer"),l.setPath(this.path),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(u){try{const h=u.slice(0);Xp.getContext().decodeAudioData(h,function(p){t(p)}).catch(c)}catch(h){c(h)}},n,i);function c(u){i?i(u):console.error(u),s.manager.itemError(e)}}}const J0=new et,K0=new et,ss=new et;class Eb{constructor(){this.type="StereoCamera",this.aspect=1,this.eyeSep=.064,this.cameraL=new fn,this.cameraL.layers.enable(1),this.cameraL.matrixAutoUpdate=!1,this.cameraR=new fn,this.cameraR.layers.enable(2),this.cameraR.matrixAutoUpdate=!1,this._cache={focus:null,fov:null,aspect:null,near:null,far:null,zoom:null,eyeSep:null}}update(e){const t=this._cache;if(t.focus!==e.focus||t.fov!==e.fov||t.aspect!==e.aspect*this.aspect||t.near!==e.near||t.far!==e.far||t.zoom!==e.zoom||t.eyeSep!==this.eyeSep){t.focus=e.focus,t.fov=e.fov,t.aspect=e.aspect*this.aspect,t.near=e.near,t.far=e.far,t.zoom=e.zoom,t.eyeSep=this.eyeSep,ss.copy(e.projectionMatrix);const i=t.eyeSep/2,s=i*t.near/t.focus,l=t.near*Math.tan(xs*t.fov*.5)/t.zoom;let c,u;K0.elements[12]=-i,J0.elements[12]=i,c=-l*t.aspect+s,u=l*t.aspect+s,ss.elements[0]=2*t.near/(u-c),ss.elements[8]=(u+c)/(u-c),this.cameraL.projectionMatrix.copy(ss),c=-l*t.aspect-s,u=l*t.aspect-s,ss.elements[0]=2*t.near/(u-c),ss.elements[8]=(u+c)/(u-c),this.cameraR.projectionMatrix.copy(ss)}this.cameraL.matrixWorld.copy(e.matrixWorld).multiply(K0),this.cameraR.matrixWorld.copy(e.matrixWorld).multiply(J0)}}class Yp{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=j0(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=j0();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function j0(){return performance.now()}const os=new D,Q0=new qn,Ab=new D,as=new D;class Tb extends bt{constructor(){super(),this.type="AudioListener",this.context=Xp.getContext(),this.gain=this.context.createGain(),this.gain.connect(this.context.destination),this.filter=null,this.timeDelta=0,this._clock=new Yp}getInput(){return this.gain}removeFilter(){return this.filter!==null&&(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination),this.gain.connect(this.context.destination),this.filter=null),this}getFilter(){return this.filter}setFilter(e){return this.filter!==null?(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination)):this.gain.disconnect(this.context.destination),this.filter=e,this.gain.connect(this.filter),this.filter.connect(this.context.destination),this}getMasterVolume(){return this.gain.gain.value}setMasterVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}updateMatrixWorld(e){super.updateMatrixWorld(e);const t=this.context.listener,n=this.up;if(this.timeDelta=this._clock.getDelta(),this.matrixWorld.decompose(os,Q0,Ab),as.set(0,0,-1).applyQuaternion(Q0),t.positionX){const i=this.context.currentTime+this.timeDelta;t.positionX.linearRampToValueAtTime(os.x,i),t.positionY.linearRampToValueAtTime(os.y,i),t.positionZ.linearRampToValueAtTime(os.z,i),t.forwardX.linearRampToValueAtTime(as.x,i),t.forwardY.linearRampToValueAtTime(as.y,i),t.forwardZ.linearRampToValueAtTime(as.z,i),t.upX.linearRampToValueAtTime(n.x,i),t.upY.linearRampToValueAtTime(n.y,i),t.upZ.linearRampToValueAtTime(n.z,i)}else t.setPosition(os.x,os.y,os.z),t.setOrientation(as.x,as.y,as.z,n.x,n.y,n.z)}}class Py extends bt{constructor(e){super(),this.type="Audio",this.listener=e,this.context=e.context,this.gain=this.context.createGain(),this.gain.connect(e.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(e){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=e,this.connect(),this}setMediaElementSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(e),this.connect(),this}setMediaStreamSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(e),this.connect(),this}setBuffer(e){return this.buffer=e,this.sourceType="buffer",this.autoplay&&this.play(),this}play(e=0){if(this.isPlaying===!0){console.warn("THREE.Audio: Audio is already playing.");return}if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}this._startedAt=this.context.currentTime+e;const t=this.context.createBufferSource();return t.buffer=this.buffer,t.loop=this.loop,t.loopStart=this.loopStart,t.loopEnd=this.loopEnd,t.onended=this.onEnded.bind(this),t.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=t,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(e=0){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this._progress=0,this.source!==null&&(this.source.stop(this.context.currentTime+e),this.source.onended=null),this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].connect(this.filters[e]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this._connected!==!1){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].disconnect(this.filters[e]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}}getFilters(){return this.filters}setFilters(e){return e||(e=[]),this._connected===!0?(this.disconnect(),this.filters=e.slice(),this.connect()):this.filters=e.slice(),this}setDetune(e){return this.detune=e,this.isPlaying===!0&&this.source.detune!==void 0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(e){return this.setFilters(e?[e]:[])}setPlaybackRate(e){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.playbackRate=e,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1}getLoop(){return this.hasPlaybackControl===!1?(console.warn("THREE.Audio: this Audio has no playback control."),!1):this.loop}setLoop(e){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.loop=e,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(e){return this.loopStart=e,this}setLoopEnd(e){return this.loopEnd=e,this}getVolume(){return this.gain.gain.value}setVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}}const ls=new D,$0=new qn,bb=new D,cs=new D;class Cb extends Py{constructor(e){super(e),this.panner=this.context.createPanner(),this.panner.panningModel="HRTF",this.panner.connect(this.gain)}connect(){super.connect(),this.panner.connect(this.gain)}disconnect(){super.disconnect(),this.panner.disconnect(this.gain)}getOutput(){return this.panner}getRefDistance(){return this.panner.refDistance}setRefDistance(e){return this.panner.refDistance=e,this}getRolloffFactor(){return this.panner.rolloffFactor}setRolloffFactor(e){return this.panner.rolloffFactor=e,this}getDistanceModel(){return this.panner.distanceModel}setDistanceModel(e){return this.panner.distanceModel=e,this}getMaxDistance(){return this.panner.maxDistance}setMaxDistance(e){return this.panner.maxDistance=e,this}setDirectionalCone(e,t,n){return this.panner.coneInnerAngle=e,this.panner.coneOuterAngle=t,this.panner.coneOuterGain=n,this}updateMatrixWorld(e){if(super.updateMatrixWorld(e),this.hasPlaybackControl===!0&&this.isPlaying===!1)return;this.matrixWorld.decompose(ls,$0,bb),cs.set(0,0,1).applyQuaternion($0);const t=this.panner;if(t.positionX){const n=this.context.currentTime+this.listener.timeDelta;t.positionX.linearRampToValueAtTime(ls.x,n),t.positionY.linearRampToValueAtTime(ls.y,n),t.positionZ.linearRampToValueAtTime(ls.z,n),t.orientationX.linearRampToValueAtTime(cs.x,n),t.orientationY.linearRampToValueAtTime(cs.y,n),t.orientationZ.linearRampToValueAtTime(cs.z,n)}else t.setPosition(ls.x,ls.y,ls.z),t.setOrientation(cs.x,cs.y,cs.z)}}class Rb{constructor(e,t=2048){this.analyser=e.context.createAnalyser(),this.analyser.fftSize=t,this.data=new Uint8Array(this.analyser.frequencyBinCount),e.getOutput().connect(this.analyser)}getFrequencyData(){return this.analyser.getByteFrequencyData(this.data),this.data}getAverageFrequency(){let e=0;const t=this.getFrequencyData();for(let n=0;n<t.length;n++)e+=t[n];return e/t.length}}class Iy{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,s,l;switch(t){case"quaternion":i=this._slerp,s=this._slerpAdditive,l=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,s=this._select,l=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,s=this._lerpAdditive,l=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=s,this._setIdentity=l,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const n=this.buffer,i=this.valueSize,s=e*i+i;let l=this.cumulativeWeight;if(l===0){for(let c=0;c!==i;++c)n[s+c]=n[c];l=t}else{l+=t;const c=t/l;this._mixBufferRegion(n,s,0,c,i)}this.cumulativeWeight=l}accumulateAdditive(e){const t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,n=this.buffer,i=e*t+t,s=this.cumulativeWeight,l=this.cumulativeWeightAdditive,c=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){const u=t*this._origIndex;this._mixBufferRegion(n,i,u,1-s,t)}l>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let u=t,h=t+t;u!==h;++u)if(n[u]!==n[u+t]){c.setValue(n,i);break}}saveOriginalState(){const e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let s=n,l=i;s!==l;++s)t[s]=t[i+s%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,s){if(i>=.5)for(let l=0;l!==s;++l)e[t+l]=e[n+l]}_slerp(e,t,n,i){qn.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,s){const l=this._workIndex*s;qn.multiplyQuaternionsFlat(e,l,e,t,e,n),qn.slerpFlat(e,t,e,t,e,l,i)}_lerp(e,t,n,i,s){const l=1-i;for(let c=0;c!==s;++c){const u=t+c;e[u]=e[u]*l+e[n+c]*i}}_lerpAdditive(e,t,n,i,s){for(let l=0;l!==s;++l){const c=t+l;e[c]=e[c]+e[n+l]*i}}}const qp="\\[\\]\\.:\\/",Pb=new RegExp("["+qp+"]","g"),Zp="[^"+qp+"]",Ib="[^"+qp.replace("\\.","")+"]",Lb=/((?:WC+[\/:])*)/.source.replace("WC",Zp),Db=/(WCOD+)?/.source.replace("WCOD",Ib),Ub=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Zp),Nb=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Zp),Ob=new RegExp("^"+Lb+Db+Ub+Nb+"$"),Fb=["material","materials","bones","map"];class Bb{constructor(e,t,n){const i=n||Tt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class Tt{constructor(e,t,n){this.path=t,this.parsedPath=n||Tt.parseTrackName(t),this.node=Tt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new Tt.Composite(e,t,n):new Tt(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Pb,"")}static parseTrackName(e){const t=Ob.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const s=n.nodeName.substring(i+1);Fb.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(s){for(let l=0;l<s.length;l++){const c=s[l];if(c.name===t||c.uuid===t)return c;const u=n(c.children);if(u)return u}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let s=t.propertyIndex;if(e||(e=Tt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let h=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let d=0;d<e.length;d++)if(e[d].name===h){h=d;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(h!==void 0){if(e[h]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[h]}}const l=e[i];if(l===void 0){const h=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+h+"."+i+" but it wasn't found.",e);return}let c=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?c=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(c=this.Versioning.MatrixWorldNeedsUpdate);let u=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}u=this.BindingType.ArrayElement,this.resolvedProperty=l,this.propertyIndex=s}else l.fromArray!==void 0&&l.toArray!==void 0?(u=this.BindingType.HasFromToArray,this.resolvedProperty=l):Array.isArray(l)?(u=this.BindingType.EntireArray,this.resolvedProperty=l):this.propertyName=i;this.getValue=this.GetterByBindingType[u],this.setValue=this.SetterByBindingTypeAndVersioning[u][c]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}Tt.Composite=Bb;Tt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Tt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Tt.prototype.GetterByBindingType=[Tt.prototype._getValue_direct,Tt.prototype._getValue_array,Tt.prototype._getValue_arrayElement,Tt.prototype._getValue_toArray];Tt.prototype.SetterByBindingTypeAndVersioning=[[Tt.prototype._setValue_direct,Tt.prototype._setValue_direct_setNeedsUpdate,Tt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Tt.prototype._setValue_array,Tt.prototype._setValue_array_setNeedsUpdate,Tt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Tt.prototype._setValue_arrayElement,Tt.prototype._setValue_arrayElement_setNeedsUpdate,Tt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Tt.prototype._setValue_fromArray,Tt.prototype._setValue_fromArray_setNeedsUpdate,Tt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class zb{constructor(){this.isAnimationObjectGroup=!0,this.uuid=ii(),this._objects=Array.prototype.slice.call(arguments),this.nCachedObjects_=0;const e={};this._indicesByUUID=e;for(let n=0,i=arguments.length;n!==i;++n)e[arguments[n].uuid]=n;this._paths=[],this._parsedPaths=[],this._bindings=[],this._bindingsIndicesByPath={};const t=this;this.stats={objects:{get total(){return t._objects.length},get inUse(){return this.total-t.nCachedObjects_}},get bindingsPerObject(){return t._bindings.length}}}add(){const e=this._objects,t=this._indicesByUUID,n=this._paths,i=this._parsedPaths,s=this._bindings,l=s.length;let c,u=e.length,h=this.nCachedObjects_;for(let d=0,p=arguments.length;d!==p;++d){const m=arguments[d],g=m.uuid;let y=t[g];if(y===void 0){y=u++,t[g]=y,e.push(m);for(let M=0,x=l;M!==x;++M)s[M].push(new Tt(m,n[M],i[M]))}else if(y<h){c=e[y];const M=--h,x=e[M];t[x.uuid]=y,e[y]=x,t[g]=M,e[M]=m;for(let _=0,E=l;_!==E;++_){const w=s[_],T=w[M];let O=w[y];w[y]=T,O===void 0&&(O=new Tt(m,n[_],i[_])),w[M]=O}}else e[y]!==c&&console.error("THREE.AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.")}this.nCachedObjects_=h}remove(){const e=this._objects,t=this._indicesByUUID,n=this._bindings,i=n.length;let s=this.nCachedObjects_;for(let l=0,c=arguments.length;l!==c;++l){const u=arguments[l],h=u.uuid,d=t[h];if(d!==void 0&&d>=s){const p=s++,m=e[p];t[m.uuid]=d,e[d]=m,t[h]=p,e[p]=u;for(let g=0,y=i;g!==y;++g){const M=n[g],x=M[p],_=M[d];M[d]=x,M[p]=_}}}this.nCachedObjects_=s}uncache(){const e=this._objects,t=this._indicesByUUID,n=this._bindings,i=n.length;let s=this.nCachedObjects_,l=e.length;for(let c=0,u=arguments.length;c!==u;++c){const h=arguments[c],d=h.uuid,p=t[d];if(p!==void 0)if(delete t[d],p<s){const m=--s,g=e[m],y=--l,M=e[y];t[g.uuid]=p,e[p]=g,t[M.uuid]=m,e[m]=M,e.pop();for(let x=0,_=i;x!==_;++x){const E=n[x],w=E[m],T=E[y];E[p]=w,E[m]=T,E.pop()}}else{const m=--l,g=e[m];m>0&&(t[g.uuid]=p),e[p]=g,e.pop();for(let y=0,M=i;y!==M;++y){const x=n[y];x[p]=x[m],x.pop()}}}this.nCachedObjects_=s}subscribe_(e,t){const n=this._bindingsIndicesByPath;let i=n[e];const s=this._bindings;if(i!==void 0)return s[i];const l=this._paths,c=this._parsedPaths,u=this._objects,h=u.length,d=this.nCachedObjects_,p=new Array(h);i=s.length,n[e]=i,l.push(e),c.push(t),s.push(p);for(let m=d,g=u.length;m!==g;++m){const y=u[m];p[m]=new Tt(y,e,t)}return p}unsubscribe_(e){const t=this._bindingsIndicesByPath,n=t[e];if(n!==void 0){const i=this._paths,s=this._parsedPaths,l=this._bindings,c=l.length-1,u=l[c],h=e[c];t[h]=n,l[n]=u,l.pop(),s[n]=s[c],s.pop(),i[n]=i[c],i.pop()}}}class Ly{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;const s=t.tracks,l=s.length,c=new Array(l),u={endingStart:ps,endingEnd:ps};for(let h=0;h!==l;++h){const d=s[h].createInterpolant(null);c[h]=d,d.settings=u}this._interpolantSettings=u,this._interpolants=c,this._propertyBindings=new Array(l),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=p_,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n){if(e.fadeOut(t),this.fadeIn(t),n){const i=this._clip.duration,s=e._clip.duration,l=s/i,c=i/s;e.warp(1,l,t),this.warp(c,1,t)}return this}crossFadeTo(e,t,n){return e.crossFadeFrom(this,t,n)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){const i=this._mixer,s=i.time,l=this.timeScale;let c=this._timeScaleInterpolant;c===null&&(c=i._lendControlInterpolant(),this._timeScaleInterpolant=c);const u=c.parameterPositions,h=c.sampleValues;return u[0]=s,u[1]=s+n,h[0]=e/l,h[1]=t/l,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}const s=this._startTime;if(s!==null){const u=(e-s)*n;u<0||n===0?t=0:(this._startTime=null,t=n*u)}t*=this._updateTimeScale(e);const l=this._updateTime(t),c=this._updateWeight(e);if(c>0){const u=this._interpolants,h=this._propertyBindings;switch(this.blendMode){case vp:for(let d=0,p=u.length;d!==p;++d)u[d].evaluate(l),h[d].accumulateAdditive(c);break;case ih:default:for(let d=0,p=u.length;d!==p;++d)u[d].evaluate(l),h[d].accumulate(i,c)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const n=this._weightInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const n=this._timeScaleInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t)}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,n=this.loop;let i=this.time+e,s=this._loopCount;const l=n===m_;if(e===0)return s===-1?i:l&&(s&1)===1?t-i:i;if(n===d_){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(s===-1&&(e>=0?(s=0,this._setEndings(!0,this.repetitions===0,l)):this._setEndings(this.repetitions===0,!0,l)),i>=t||i<0){const c=Math.floor(i/t);i-=t*c,s+=Math.abs(c);const u=this.repetitions-s;if(u<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(u===1){const h=e<0;this._setEndings(h,!h,l)}else this._setEndings(!1,!1,l);this._loopCount=s,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:c})}}else this.time=i;if(l&&(s&1)===1)return t-i}return i}_setEndings(e,t,n){const i=this._interpolantSettings;n?(i.endingStart=ms,i.endingEnd=ms):(e?i.endingStart=this.zeroSlopeAtStart?ms:ps:i.endingStart=La,t?i.endingEnd=this.zeroSlopeAtEnd?ms:ps:i.endingEnd=La)}_scheduleFading(e,t,n){const i=this._mixer,s=i.time;let l=this._weightInterpolant;l===null&&(l=i._lendControlInterpolant(),this._weightInterpolant=l);const c=l.parameterPositions,u=l.sampleValues;return c[0]=s,u[0]=t,c[1]=s+e,u[1]=n,this}}const kb=new Float32Array(1);class Hb extends Yi{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){const n=e._localRoot||this._root,i=e._clip.tracks,s=i.length,l=e._propertyBindings,c=e._interpolants,u=n.uuid,h=this._bindingsByRootAndName;let d=h[u];d===void 0&&(d={},h[u]=d);for(let p=0;p!==s;++p){const m=i[p],g=m.name;let y=d[g];if(y!==void 0)++y.referenceCount,l[p]=y;else{if(y=l[p],y!==void 0){y._cacheIndex===null&&(++y.referenceCount,this._addInactiveBinding(y,u,g));continue}const M=t&&t._propertyBindings[p].binding.parsedPath;y=new Iy(Tt.create(n,g,M),m.ValueTypeName,m.getValueSize()),++y.referenceCount,this._addInactiveBinding(y,u,g),l[p]=y}c[p].resultBuffer=y.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const n=(e._localRoot||this._root).uuid,i=e._clip.uuid,s=this._actionsByClip[i];this._bindAction(e,s&&s.knownActions[0]),this._addInactiveAction(e,i,n)}const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const s=t[n];s.useCount++===0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const s=t[n];--s.useCount===0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){const i=this._actions,s=this._actionsByClip;let l=s[t];if(l===void 0)l={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,s[t]=l;else{const c=l.knownActions;e._byClipCacheIndex=c.length,c.push(e)}e._cacheIndex=i.length,i.push(e),l.actionByRoot[n]=e}_removeInactiveAction(e){const t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;const s=e._clip.uuid,l=this._actionsByClip,c=l[s],u=c.knownActions,h=u[u.length-1],d=e._byClipCacheIndex;h._byClipCacheIndex=d,u[d]=h,u.pop(),e._byClipCacheIndex=null;const p=c.actionByRoot,m=(e._localRoot||this._root).uuid;delete p[m],u.length===0&&delete l[s],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const s=t[n];--s.referenceCount===0&&this._removeInactiveBinding(s)}}_lendAction(e){const t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackAction(e){const t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_addInactiveBinding(e,t,n){const i=this._bindingsByRootAndName,s=this._bindings;let l=i[t];l===void 0&&(l={},i[t]=l),l[n]=e,e._cacheIndex=s.length,s.push(e)}_removeInactiveBinding(e){const t=this._bindings,n=e.binding,i=n.rootNode.uuid,s=n.path,l=this._bindingsByRootAndName,c=l[i],u=t[t.length-1],h=e._cacheIndex;u._cacheIndex=h,t[h]=u,t.pop(),delete c[s],Object.keys(c).length===0&&delete l[i]}_lendBinding(e){const t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackBinding(e){const t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let n=e[t];return n===void 0&&(n=new kp(new Float32Array(2),new Float32Array(2),1,kb),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){const t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,s=t[i];e.__cacheIndex=i,t[i]=e,s.__cacheIndex=n,t[n]=s}clipAction(e,t,n){const i=t||this._root,s=i.uuid;let l=typeof e=="string"?Xa.findByName(i,e):e;const c=l!==null?l.uuid:e,u=this._actionsByClip[c];let h=null;if(n===void 0&&(l!==null?n=l.blendMode:n=ih),u!==void 0){const p=u.actionByRoot[s];if(p!==void 0&&p.blendMode===n)return p;h=u.knownActions[0],l===null&&(l=h._clip)}if(l===null)return null;const d=new Ly(this,l,t,n);return this._bindAction(d,h),this._addInactiveAction(d,c,s),d}existingAction(e,t){const n=t||this._root,i=n.uuid,s=typeof e=="string"?Xa.findByName(n,e):e,l=s?s.uuid:e,c=this._actionsByClip[l];return c!==void 0&&c.actionByRoot[i]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;const t=this._actions,n=this._nActiveActions,i=this.time+=e,s=Math.sign(e),l=this._accuIndex^=1;for(let h=0;h!==n;++h)t[h]._update(i,e,s,l);const c=this._bindings,u=this._nActiveBindings;for(let h=0;h!==u;++h)c[h].apply(l);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,n=e.uuid,i=this._actionsByClip,s=i[n];if(s!==void 0){const l=s.knownActions;for(let c=0,u=l.length;c!==u;++c){const h=l[c];this._deactivateAction(h);const d=h._cacheIndex,p=t[t.length-1];h._cacheIndex=null,h._byClipCacheIndex=null,p._cacheIndex=d,t[d]=p,t.pop(),this._removeInactiveBindingsForAction(h)}delete i[n]}}uncacheRoot(e){const t=e.uuid,n=this._actionsByClip;for(const l in n){const c=n[l].actionByRoot,u=c[t];u!==void 0&&(this._deactivateAction(u),this._removeInactiveAction(u))}const i=this._bindingsByRootAndName,s=i[t];if(s!==void 0)for(const l in s){const c=s[l];c.restoreOriginalState(),this._removeInactiveBinding(c)}}uncacheAction(e,t){const n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}class Jp{constructor(e){this.value=e}clone(){return new Jp(this.value.clone===void 0?this.value:this.value.clone())}}let Vb=0;class Gb extends Yi{constructor(){super(),this.isUniformsGroup=!0,Object.defineProperty(this,"id",{value:Vb++}),this.name="",this.usage=Oa,this.uniforms=[]}add(e){return this.uniforms.push(e),this}remove(e){const t=this.uniforms.indexOf(e);return t!==-1&&this.uniforms.splice(t,1),this}setName(e){return this.name=e,this}setUsage(e){return this.usage=e,this}dispose(){return this.dispatchEvent({type:"dispose"}),this}copy(e){this.name=e.name,this.usage=e.usage;const t=e.uniforms;this.uniforms.length=0;for(let n=0,i=t.length;n<i;n++){const s=Array.isArray(t[n])?t[n]:[t[n]];for(let l=0;l<s.length;l++)this.uniforms.push(s[l].clone())}return this}clone(){return new this.constructor().copy(this)}}class Yu extends ch{constructor(e,t,n=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){const t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){const t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}}class Wb{constructor(e,t,n,i,s){this.isGLBufferAttribute=!0,this.name="",this.buffer=e,this.type=t,this.itemSize=n,this.elementSize=i,this.count=s,this.version=0}set needsUpdate(e){e===!0&&this.version++}setBuffer(e){return this.buffer=e,this}setType(e,t){return this.type=e,this.elementSize=t,this}setItemSize(e){return this.itemSize=e,this}setCount(e){return this.count=e,this}}const ev=new et;class Dy{constructor(e,t,n=0,i=1/0){this.ray=new Io(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Ss,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return ev.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(ev),this}intersectObject(e,t=!0,n=[]){return ip(e,this,n,t),n.sort(tv),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)ip(e[i],this,n,t);return n.sort(tv),n}}function tv(r,e){return r.distance-e.distance}function ip(r,e,t,n){let i=!0;if(r.layers.test(e.layers)&&r.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const s=r.children;for(let l=0,c=s.length;l<c;l++)ip(s[l],e,t,!0)}}class Xb{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Zt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Yb{constructor(e=1,t=0,n=0){return this.radius=e,this.theta=t,this.y=n,this}set(e,t,n){return this.radius=e,this.theta=t,this.y=n,this}copy(e){return this.radius=e.radius,this.theta=e.theta,this.y=e.y,this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+n*n),this.theta=Math.atan2(e,n),this.y=t,this}clone(){return new this.constructor().copy(this)}}class Kp{constructor(e,t,n,i){Kp.prototype.isMatrix2=!0,this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){const s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=i,this}}const nv=new fe;class qb{constructor(e=new fe(1/0,1/0),t=new fe(-1/0,-1/0)){this.isBox2=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=nv.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(e){return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,nv).distanceTo(e)}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const iv=new D,Xc=new D;class Uy{constructor(e=new D,t=new D){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){iv.subVectors(e,this.start),Xc.subVectors(this.end,this.start);const n=Xc.dot(Xc);let s=Xc.dot(iv)/n;return t&&(s=Zt(s,0,1)),s}closestPointToPoint(e,t,n){const i=this.closestPointToPointParameter(e,t);return this.delta(n).multiplyScalar(i).add(this.start)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}const rv=new D;class Zb extends bt{constructor(e,t){super(),this.light=e,this.matrixAutoUpdate=!1,this.color=t,this.type="SpotLightHelper";const n=new gt,i=[0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,-1,0,1,0,0,0,0,1,1,0,0,0,0,-1,1];for(let l=0,c=1,u=32;l<u;l++,c++){const h=l/u*Math.PI*2,d=c/u*Math.PI*2;i.push(Math.cos(h),Math.sin(h),1,Math.cos(d),Math.sin(d),1)}n.setAttribute("position",new Xe(i,3));const s=new zn({fog:!1,toneMapped:!1});this.cone=new qi(n,s),this.add(this.cone),this.update()}dispose(){this.cone.geometry.dispose(),this.cone.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),this.parent?(this.parent.updateWorldMatrix(!0),this.matrix.copy(this.parent.matrixWorld).invert().multiply(this.light.matrixWorld)):this.matrix.copy(this.light.matrixWorld),this.matrixWorld.copy(this.light.matrixWorld);const e=this.light.distance?this.light.distance:1e3,t=e*Math.tan(this.light.angle);this.cone.scale.set(t,t,e),rv.setFromMatrixPosition(this.light.target.matrixWorld),this.cone.lookAt(rv),this.color!==void 0?this.cone.material.color.set(this.color):this.cone.material.color.copy(this.light.color)}}const Ur=new D,Yc=new et,Ed=new et;class Jb extends qi{constructor(e){const t=Ny(e),n=new gt,i=[],s=[],l=new Ie(0,0,1),c=new Ie(0,1,0);for(let h=0;h<t.length;h++){const d=t[h];d.parent&&d.parent.isBone&&(i.push(0,0,0),i.push(0,0,0),s.push(l.r,l.g,l.b),s.push(c.r,c.g,c.b))}n.setAttribute("position",new Xe(i,3)),n.setAttribute("color",new Xe(s,3));const u=new zn({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(n,u),this.isSkeletonHelper=!0,this.type="SkeletonHelper",this.root=e,this.bones=t,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1}updateMatrixWorld(e){const t=this.bones,n=this.geometry,i=n.getAttribute("position");Ed.copy(this.root.matrixWorld).invert();for(let s=0,l=0;s<t.length;s++){const c=t[s];c.parent&&c.parent.isBone&&(Yc.multiplyMatrices(Ed,c.matrixWorld),Ur.setFromMatrixPosition(Yc),i.setXYZ(l,Ur.x,Ur.y,Ur.z),Yc.multiplyMatrices(Ed,c.parent.matrixWorld),Ur.setFromMatrixPosition(Yc),i.setXYZ(l+1,Ur.x,Ur.y,Ur.z),l+=2)}n.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(e)}dispose(){this.geometry.dispose(),this.material.dispose()}}function Ny(r){const e=[];r.isBone===!0&&e.push(r);for(let t=0;t<r.children.length;t++)e.push.apply(e,Ny(r.children[t]));return e}class Kb extends Qt{constructor(e,t,n){const i=new il(t,4,2),s=new kr({wireframe:!0,fog:!1,toneMapped:!1});super(i,s),this.light=e,this.color=n,this.type="PointLightHelper",this.matrix=this.light.matrixWorld,this.matrixAutoUpdate=!1,this.update()}dispose(){this.geometry.dispose(),this.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.color!==void 0?this.material.color.set(this.color):this.material.color.copy(this.light.color)}}const jb=new D,sv=new Ie,ov=new Ie;class Qb extends bt{constructor(e,t,n){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="HemisphereLightHelper";const i=new nl(t);i.rotateY(Math.PI*.5),this.material=new kr({wireframe:!0,fog:!1,toneMapped:!1}),this.color===void 0&&(this.material.vertexColors=!0);const s=i.getAttribute("position"),l=new Float32Array(s.count*3);i.setAttribute("color",new Nt(l,3)),this.add(new Qt(i,this.material)),this.update()}dispose(){this.children[0].geometry.dispose(),this.children[0].material.dispose()}update(){const e=this.children[0];if(this.color!==void 0)this.material.color.set(this.color);else{const t=e.geometry.getAttribute("color");sv.copy(this.light.color),ov.copy(this.light.groundColor);for(let n=0,i=t.count;n<i;n++){const s=n<i/2?sv:ov;t.setXYZ(n,s.r,s.g,s.b)}t.needsUpdate=!0}this.light.updateWorldMatrix(!0,!1),e.lookAt(jb.setFromMatrixPosition(this.light.matrixWorld).negate())}}class $b extends qi{constructor(e=10,t=10,n=4473924,i=8947848){n=new Ie(n),i=new Ie(i);const s=t/2,l=e/t,c=e/2,u=[],h=[];for(let m=0,g=0,y=-c;m<=t;m++,y+=l){u.push(-c,0,y,c,0,y),u.push(y,0,-c,y,0,c);const M=m===s?n:i;M.toArray(h,g),g+=3,M.toArray(h,g),g+=3,M.toArray(h,g),g+=3,M.toArray(h,g),g+=3}const d=new gt;d.setAttribute("position",new Xe(u,3)),d.setAttribute("color",new Xe(h,3));const p=new zn({vertexColors:!0,toneMapped:!1});super(d,p),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class eC extends qi{constructor(e=10,t=16,n=8,i=64,s=4473924,l=8947848){s=new Ie(s),l=new Ie(l);const c=[],u=[];if(t>1)for(let p=0;p<t;p++){const m=p/t*(Math.PI*2),g=Math.sin(m)*e,y=Math.cos(m)*e;c.push(0,0,0),c.push(g,0,y);const M=p&1?s:l;u.push(M.r,M.g,M.b),u.push(M.r,M.g,M.b)}for(let p=0;p<n;p++){const m=p&1?s:l,g=e-e/n*p;for(let y=0;y<i;y++){let M=y/i*(Math.PI*2),x=Math.sin(M)*g,_=Math.cos(M)*g;c.push(x,0,_),u.push(m.r,m.g,m.b),M=(y+1)/i*(Math.PI*2),x=Math.sin(M)*g,_=Math.cos(M)*g,c.push(x,0,_),u.push(m.r,m.g,m.b)}}const h=new gt;h.setAttribute("position",new Xe(c,3)),h.setAttribute("color",new Xe(u,3));const d=new zn({vertexColors:!0,toneMapped:!1});super(h,d),this.type="PolarGridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}const av=new D,qc=new D,lv=new D;class tC extends bt{constructor(e,t,n){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="DirectionalLightHelper",t===void 0&&(t=1);let i=new gt;i.setAttribute("position",new Xe([-t,t,0,t,t,0,t,-t,0,-t,-t,0,-t,t,0],3));const s=new zn({fog:!1,toneMapped:!1});this.lightPlane=new Br(i,s),this.add(this.lightPlane),i=new gt,i.setAttribute("position",new Xe([0,0,0,0,0,1],3)),this.targetLine=new Br(i,s),this.add(this.targetLine),this.update()}dispose(){this.lightPlane.geometry.dispose(),this.lightPlane.material.dispose(),this.targetLine.geometry.dispose(),this.targetLine.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),av.setFromMatrixPosition(this.light.matrixWorld),qc.setFromMatrixPosition(this.light.target.matrixWorld),lv.subVectors(qc,av),this.lightPlane.lookAt(qc),this.color!==void 0?(this.lightPlane.material.color.set(this.color),this.targetLine.material.color.set(this.color)):(this.lightPlane.material.color.copy(this.light.color),this.targetLine.material.color.copy(this.light.color)),this.targetLine.lookAt(qc),this.targetLine.scale.z=lv.length()}}const Zc=new D,qt=new ja;class nC extends qi{constructor(e){const t=new gt,n=new zn({color:16777215,vertexColors:!0,toneMapped:!1}),i=[],s=[],l={};c("n1","n2"),c("n2","n4"),c("n4","n3"),c("n3","n1"),c("f1","f2"),c("f2","f4"),c("f4","f3"),c("f3","f1"),c("n1","f1"),c("n2","f2"),c("n3","f3"),c("n4","f4"),c("p","n1"),c("p","n2"),c("p","n3"),c("p","n4"),c("u1","u2"),c("u2","u3"),c("u3","u1"),c("c","t"),c("p","c"),c("cn1","cn2"),c("cn3","cn4"),c("cf1","cf2"),c("cf3","cf4");function c(y,M){u(y),u(M)}function u(y){i.push(0,0,0),s.push(0,0,0),l[y]===void 0&&(l[y]=[]),l[y].push(i.length/3-1)}t.setAttribute("position",new Xe(i,3)),t.setAttribute("color",new Xe(s,3)),super(t,n),this.type="CameraHelper",this.camera=e,this.camera.updateProjectionMatrix&&this.camera.updateProjectionMatrix(),this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.pointMap=l,this.update();const h=new Ie(16755200),d=new Ie(16711680),p=new Ie(43775),m=new Ie(16777215),g=new Ie(3355443);this.setColors(h,d,p,m,g)}setColors(e,t,n,i,s){const c=this.geometry.getAttribute("color");c.setXYZ(0,e.r,e.g,e.b),c.setXYZ(1,e.r,e.g,e.b),c.setXYZ(2,e.r,e.g,e.b),c.setXYZ(3,e.r,e.g,e.b),c.setXYZ(4,e.r,e.g,e.b),c.setXYZ(5,e.r,e.g,e.b),c.setXYZ(6,e.r,e.g,e.b),c.setXYZ(7,e.r,e.g,e.b),c.setXYZ(8,e.r,e.g,e.b),c.setXYZ(9,e.r,e.g,e.b),c.setXYZ(10,e.r,e.g,e.b),c.setXYZ(11,e.r,e.g,e.b),c.setXYZ(12,e.r,e.g,e.b),c.setXYZ(13,e.r,e.g,e.b),c.setXYZ(14,e.r,e.g,e.b),c.setXYZ(15,e.r,e.g,e.b),c.setXYZ(16,e.r,e.g,e.b),c.setXYZ(17,e.r,e.g,e.b),c.setXYZ(18,e.r,e.g,e.b),c.setXYZ(19,e.r,e.g,e.b),c.setXYZ(20,e.r,e.g,e.b),c.setXYZ(21,e.r,e.g,e.b),c.setXYZ(22,e.r,e.g,e.b),c.setXYZ(23,e.r,e.g,e.b),c.setXYZ(24,t.r,t.g,t.b),c.setXYZ(25,t.r,t.g,t.b),c.setXYZ(26,t.r,t.g,t.b),c.setXYZ(27,t.r,t.g,t.b),c.setXYZ(28,t.r,t.g,t.b),c.setXYZ(29,t.r,t.g,t.b),c.setXYZ(30,t.r,t.g,t.b),c.setXYZ(31,t.r,t.g,t.b),c.setXYZ(32,n.r,n.g,n.b),c.setXYZ(33,n.r,n.g,n.b),c.setXYZ(34,n.r,n.g,n.b),c.setXYZ(35,n.r,n.g,n.b),c.setXYZ(36,n.r,n.g,n.b),c.setXYZ(37,n.r,n.g,n.b),c.setXYZ(38,i.r,i.g,i.b),c.setXYZ(39,i.r,i.g,i.b),c.setXYZ(40,s.r,s.g,s.b),c.setXYZ(41,s.r,s.g,s.b),c.setXYZ(42,s.r,s.g,s.b),c.setXYZ(43,s.r,s.g,s.b),c.setXYZ(44,s.r,s.g,s.b),c.setXYZ(45,s.r,s.g,s.b),c.setXYZ(46,s.r,s.g,s.b),c.setXYZ(47,s.r,s.g,s.b),c.setXYZ(48,s.r,s.g,s.b),c.setXYZ(49,s.r,s.g,s.b),c.needsUpdate=!0}update(){const e=this.geometry,t=this.pointMap,n=1,i=1;qt.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse),jt("c",t,e,qt,0,0,-1),jt("t",t,e,qt,0,0,1),jt("n1",t,e,qt,-n,-i,-1),jt("n2",t,e,qt,n,-i,-1),jt("n3",t,e,qt,-n,i,-1),jt("n4",t,e,qt,n,i,-1),jt("f1",t,e,qt,-n,-i,1),jt("f2",t,e,qt,n,-i,1),jt("f3",t,e,qt,-n,i,1),jt("f4",t,e,qt,n,i,1),jt("u1",t,e,qt,n*.7,i*1.1,-1),jt("u2",t,e,qt,-n*.7,i*1.1,-1),jt("u3",t,e,qt,0,i*2,-1),jt("cf1",t,e,qt,-n,0,1),jt("cf2",t,e,qt,n,0,1),jt("cf3",t,e,qt,0,-i,1),jt("cf4",t,e,qt,0,i,1),jt("cn1",t,e,qt,-n,0,-1),jt("cn2",t,e,qt,n,0,-1),jt("cn3",t,e,qt,0,-i,-1),jt("cn4",t,e,qt,0,i,-1),e.getAttribute("position").needsUpdate=!0}dispose(){this.geometry.dispose(),this.material.dispose()}}function jt(r,e,t,n,i,s,l){Zc.set(i,s,l).unproject(n);const c=e[r];if(c!==void 0){const u=t.getAttribute("position");for(let h=0,d=c.length;h<d;h++)u.setXYZ(c[h],Zc.x,Zc.y,Zc.z)}}const Jc=new pn;class iC extends qi{constructor(e,t=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=new Float32Array(8*3),s=new gt;s.setIndex(new Nt(n,1)),s.setAttribute("position",new Nt(i,3)),super(s,new zn({color:t,toneMapped:!1})),this.object=e,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(e){if(e!==void 0&&console.warn("THREE.BoxHelper: .update() has no longer arguments."),this.object!==void 0&&Jc.setFromObject(this.object),Jc.isEmpty())return;const t=Jc.min,n=Jc.max,i=this.geometry.attributes.position,s=i.array;s[0]=n.x,s[1]=n.y,s[2]=n.z,s[3]=t.x,s[4]=n.y,s[5]=n.z,s[6]=t.x,s[7]=t.y,s[8]=n.z,s[9]=n.x,s[10]=t.y,s[11]=n.z,s[12]=n.x,s[13]=n.y,s[14]=t.z,s[15]=t.x,s[16]=n.y,s[17]=t.z,s[18]=t.x,s[19]=t.y,s[20]=t.z,s[21]=n.x,s[22]=t.y,s[23]=t.z,i.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(e){return this.object=e,this.update(),this}copy(e,t){return super.copy(e,t),this.object=e.object,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class rC extends qi{constructor(e,t=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],s=new gt;s.setIndex(new Nt(n,1)),s.setAttribute("position",new Xe(i,3)),super(s,new zn({color:t,toneMapped:!1})),this.box=e,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(e){const t=this.box;t.isEmpty()||(t.getCenter(this.position),t.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(e))}dispose(){this.geometry.dispose(),this.material.dispose()}}class sC extends Br{constructor(e,t=1,n=16776960){const i=n,s=[1,-1,0,-1,1,0,-1,-1,0,1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0],l=new gt;l.setAttribute("position",new Xe(s,3)),l.computeBoundingSphere(),super(l,new zn({color:i,toneMapped:!1})),this.type="PlaneHelper",this.plane=e,this.size=t;const c=[1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0],u=new gt;u.setAttribute("position",new Xe(c,3)),u.computeBoundingSphere(),this.add(new Qt(u,new kr({color:i,opacity:.2,transparent:!0,depthWrite:!1,toneMapped:!1})))}updateMatrixWorld(e){this.position.set(0,0,0),this.scale.set(.5*this.size,.5*this.size,1),this.lookAt(this.plane.normal),this.translateZ(-this.plane.constant),super.updateMatrixWorld(e)}dispose(){this.geometry.dispose(),this.material.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}}const cv=new D;let Kc,Ad;class oC extends bt{constructor(e=new D(0,0,1),t=new D(0,0,0),n=1,i=16776960,s=n*.2,l=s*.2){super(),this.type="ArrowHelper",Kc===void 0&&(Kc=new gt,Kc.setAttribute("position",new Xe([0,0,0,0,1,0],3)),Ad=new Do(0,.5,1,5,1),Ad.translate(0,-.5,0)),this.position.copy(t),this.line=new Br(Kc,new zn({color:i,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new Qt(Ad,new kr({color:i,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e),this.setLength(n,s,l)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{cv.set(e.z,0,-e.x).normalize();const t=Math.acos(e.y);this.quaternion.setFromAxisAngle(cv,t)}}setLength(e,t=e*.2,n=t*.2){this.line.scale.set(1,Math.max(1e-4,e-t),1),this.line.updateMatrix(),this.cone.scale.set(n,t,n),this.cone.position.y=e,this.cone.updateMatrix()}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}class aC extends qi{constructor(e=1){const t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],i=new gt;i.setAttribute("position",new Xe(t,3)),i.setAttribute("color",new Xe(n,3));const s=new zn({vertexColors:!0,toneMapped:!1});super(i,s),this.type="AxesHelper"}setColors(e,t,n){const i=new Ie,s=this.geometry.attributes.color.array;return i.set(e),i.toArray(s,0),i.toArray(s,3),i.set(t),i.toArray(s,6),i.toArray(s,9),i.set(n),i.toArray(s,12),i.toArray(s,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class lC{constructor(){this.type="ShapePath",this.color=new Ie,this.subPaths=[],this.currentPath=null}moveTo(e,t){return this.currentPath=new za,this.subPaths.push(this.currentPath),this.currentPath.moveTo(e,t),this}lineTo(e,t){return this.currentPath.lineTo(e,t),this}quadraticCurveTo(e,t,n,i){return this.currentPath.quadraticCurveTo(e,t,n,i),this}bezierCurveTo(e,t,n,i,s,l){return this.currentPath.bezierCurveTo(e,t,n,i,s,l),this}splineThru(e){return this.currentPath.splineThru(e),this}toShapes(e){function t(_){const E=[];for(let w=0,T=_.length;w<T;w++){const O=_[w],P=new Ms;P.curves=O.curves,E.push(P)}return E}function n(_,E){const w=E.length;let T=!1;for(let O=w-1,P=0;P<w;O=P++){let L=E[O],z=E[P],X=z.x-L.x,b=z.y-L.y;if(Math.abs(b)>Number.EPSILON){if(b<0&&(L=E[P],X=-X,z=E[O],b=-b),_.y<L.y||_.y>z.y)continue;if(_.y===L.y){if(_.x===L.x)return!0}else{const C=b*(_.x-L.x)-X*(_.y-L.y);if(C===0)return!0;if(C<0)continue;T=!T}}else{if(_.y!==L.y)continue;if(z.x<=_.x&&_.x<=L.x||L.x<=_.x&&_.x<=z.x)return!0}}return T}const i=Xi.isClockWise,s=this.subPaths;if(s.length===0)return[];let l,c,u;const h=[];if(s.length===1)return c=s[0],u=new Ms,u.curves=c.curves,h.push(u),h;let d=!i(s[0].getPoints());d=e?!d:d;const p=[],m=[];let g=[],y=0,M;m[y]=void 0,g[y]=[];for(let _=0,E=s.length;_<E;_++)c=s[_],M=c.getPoints(),l=i(M),l=e?!l:l,l?(!d&&m[y]&&y++,m[y]={s:new Ms,p:M},m[y].s.curves=c.curves,d&&y++,g[y]=[]):g[y].push({h:c,p:M[0]});if(!m[0])return t(s);if(m.length>1){let _=!1,E=0;for(let w=0,T=m.length;w<T;w++)p[w]=[];for(let w=0,T=m.length;w<T;w++){const O=g[w];for(let P=0;P<O.length;P++){const L=O[P];let z=!0;for(let X=0;X<m.length;X++)n(L.p,m[X].p)&&(w!==X&&E++,z?(z=!1,p[X].push(L)):_=!0);z&&p[w].push(L)}}E>0&&_===!1&&(g=p)}let x;for(let _=0,E=m.length;_<E;_++){u=m[_].s,h.push(u),x=g[_];for(let w=0,T=x.length;w<T;w++)u.holes.push(x[w].h)}return h}}class cC extends Yi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}class uC extends Ti{constructor(e=1,t=1,n=1,i={}){console.warn('THREE.WebGLMultipleRenderTargets has been deprecated and will be removed in r172. Use THREE.WebGLRenderTarget and set the "count" parameter to enable MRT.'),super(e,t,{...i,count:n}),this.isWebGLMultipleRenderTargets=!0}get texture(){return this.textures}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:qa}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=qa);const hC=Object.freeze(Object.defineProperty({__proto__:null,ACESFilmicToneMapping:op,AddEquation:Or,AddOperation:s_,AdditiveAnimationBlendMode:vp,AdditiveBlending:Gd,AgXToneMapping:u_,AlphaFormat:hp,AlwaysCompare:A_,AlwaysDepth:cu,AlwaysStencilFunc:qd,AmbientLight:Ay,AnimationAction:Ly,AnimationClip:Xa,AnimationLoader:fb,AnimationMixer:Hb,AnimationObjectGroup:zb,AnimationUtils:lb,ArcCurve:j_,ArrayCamera:H_,ArrowHelper:oC,AttachedBindMode:Yd,Audio:Py,AudioAnalyser:Rb,AudioContext:Xp,AudioListener:Tb,AudioLoader:wb,AxesHelper:aC,BackSide:Bn,BasicDepthPacking:g_,BasicShadowMap:zv,BatchedMesh:Z_,Bone:Rp,BooleanKeyframeTrack:Ps,Box2:qb,Box3:pn,Box3Helper:rC,BoxGeometry:Cs,BoxHelper:iC,BufferAttribute:Nt,BufferGeometry:gt,BufferGeometryLoader:Ry,ByteType:lp,Cache:ur,Camera:ja,CameraHelper:nC,CanvasTexture:LT,CapsuleGeometry:dh,CatmullRomCurve3:Q_,CineonToneMapping:l_,CircleGeometry:ph,ClampToEdgeWrapping:mi,Clock:Yp,Color:Ie,ColorKeyframeTrack:Hp,ColorManagement:Lt,CompressedArrayTexture:PT,CompressedCubeTexture:IT,CompressedTexture:hh,CompressedTextureLoader:db,ConeGeometry:mh,ConstantAlphaFactor:n_,ConstantColorFactor:e_,Controls:cC,CubeCamera:D_,CubeReflectionMapping:dr,CubeRefractionMapping:Fr,CubeTexture:Qa,CubeTextureLoader:pb,CubeUVReflectionMapping:Ro,CubicBezierCurve:Lp,CubicBezierCurve3:$_,CubicInterpolant:vy,CullFaceBack:Vd,CullFaceFront:Bv,CullFaceFrontBack:sS,CullFaceNone:Fv,Curve:bi,CurvePath:ty,CustomBlending:kv,CustomToneMapping:c_,CylinderGeometry:Do,Cylindrical:Yb,Data3DTexture:xp,DataArrayTexture:sh,DataTexture:Wi,DataTextureLoader:mb,DataUtils:yM,DecrementStencilOp:yS,DecrementWrapStencilOp:SS,DefaultLoadingManager:xy,DepthFormat:ys,DepthStencilFormat:Ts,DepthTexture:Ep,DetachedBindMode:f_,DirectionalLight:Ey,DirectionalLightHelper:tC,DiscreteInterpolant:_y,DisplayP3ColorSpace:rh,DodecahedronGeometry:gh,DoubleSide:zi,DstAlphaFactor:Jv,DstColorFactor:jv,DynamicCopyUsage:OS,DynamicDrawUsage:PS,DynamicReadUsage:DS,EdgesGeometry:ny,EllipseCurve:fh,EqualCompare:S_,EqualDepth:hu,EqualStencilFunc:AS,EquirectangularReflectionMapping:ba,EquirectangularRefractionMapping:Ca,Euler:ri,EventDispatcher:Yi,ExtrudeGeometry:_h,FileLoader:mr,Float16BufferAttribute:AM,Float32BufferAttribute:Xe,FloatType:Yn,Fog:lh,FogExp2:ah,FramebufferTexture:RT,FrontSide:fr,Frustum:$a,GLBufferAttribute:Wb,GLSL1:BS,GLSL3:Zd,GreaterCompare:M_,GreaterDepth:du,GreaterEqualCompare:E_,GreaterEqualDepth:fu,GreaterEqualStencilFunc:RS,GreaterStencilFunc:bS,GridHelper:$b,Group:xo,HalfFloatType:Po,HemisphereLight:Sy,HemisphereLightHelper:Qb,IcosahedronGeometry:yh,ImageBitmapLoader:Mb,ImageLoader:Ya,ImageUtils:R_,IncrementStencilOp:_S,IncrementWrapStencilOp:xS,InstancedBufferAttribute:bo,InstancedBufferGeometry:Wp,InstancedInterleavedBuffer:Yu,InstancedMesh:q_,Int16BufferAttribute:wM,Int32BufferAttribute:EM,Int8BufferAttribute:xM,IntType:ju,InterleavedBuffer:ch,InterleavedBufferAttribute:ni,Interpolant:rl,InterpolateDiscrete:Ia,InterpolateLinear:Hu,InterpolateSmooth:nu,InvertStencilOp:MS,KeepStencilOp:us,KeyframeTrack:Ci,LOD:X_,LatheGeometry:tl,Layers:Ss,LessCompare:x_,LessDepth:uu,LessEqualCompare:_p,LessEqualDepth:Es,LessEqualStencilFunc:TS,LessStencilFunc:ES,Light:Vr,LightProbe:Cy,Line:Br,Line3:Uy,LineBasicMaterial:zn,LineCurve:Dp,LineCurve3:ey,LineDashedMaterial:py,LineLoop:J_,LineSegments:qi,LinearDisplayP3ColorSpace:Ka,LinearFilter:nn,LinearInterpolant:kp,LinearMipMapLinearFilter:cS,LinearMipMapNearestFilter:lS,LinearMipmapLinearFilter:Hi,LinearMipmapNearestFilter:_a,LinearSRGBColorSpace:gr,LinearToneMapping:o_,LinearTransfer:Da,Loader:Zn,LoaderUtils:np,LoadingManager:Vp,LoopOnce:d_,LoopPingPong:m_,LoopRepeat:p_,LuminanceAlphaFormat:pp,LuminanceFormat:dp,MOUSE:iS,Material:Pn,MaterialLoader:Th,MathUtils:T_,Matrix2:Kp,Matrix3:ft,Matrix4:et,MaxEquation:Wv,Mesh:Qt,MeshBasicMaterial:kr,MeshDepthMaterial:Ap,MeshDistanceMaterial:Tp,MeshLambertMaterial:fy,MeshMatcapMaterial:dy,MeshNormalMaterial:hy,MeshPhongMaterial:cy,MeshPhysicalMaterial:ly,MeshStandardMaterial:Bp,MeshToonMaterial:uy,MinEquation:Gv,MirroredRepeatWrapping:Pa,MixOperation:r_,MultiplyBlending:Xd,MultiplyOperation:Za,NearestFilter:dn,NearestMipMapLinearFilter:aS,NearestMipMapNearestFilter:oS,NearestMipmapLinearFilter:vo,NearestMipmapNearestFilter:ap,NeutralToneMapping:h_,NeverCompare:y_,NeverDepth:lu,NeverStencilFunc:wS,NoBlending:hr,NoColorSpace:ar,NoToneMapping:Gi,NormalAnimationBlendMode:ih,NormalBlending:_s,NotEqualCompare:w_,NotEqualDepth:pu,NotEqualStencilFunc:CS,NumberKeyframeTrack:Ga,Object3D:bt,ObjectLoader:xb,ObjectSpaceNormalMap:__,OctahedronGeometry:nl,OneFactor:Yv,OneMinusConstantAlphaFactor:i_,OneMinusConstantColorFactor:t_,OneMinusDstAlphaFactor:Kv,OneMinusDstColorFactor:Qv,OneMinusSrcAlphaFactor:au,OneMinusSrcColorFactor:Zv,OrthographicCamera:el,P3Primaries:Na,PCFShadowMap:Ju,PCFSoftShadowMap:va,PMREMGenerator:Jd,Path:za,PerspectiveCamera:fn,Plane:Nr,PlaneGeometry:Rs,PlaneHelper:sC,PointLight:wy,PointLightHelper:Kb,Points:K_,PointsMaterial:Pp,PolarGridHelper:eC,PolyhedronGeometry:Hr,PositionalAudio:Cb,PropertyBinding:Tt,PropertyMixer:Iy,QuadraticBezierCurve:Up,QuadraticBezierCurve3:Np,Quaternion:qn,QuaternionKeyframeTrack:sl,QuaternionLinearInterpolant:yy,RED_GREEN_RGTC2_Format:zu,RED_RGTC1_Format:gp,REVISION:qa,RGBADepthPacking:v_,RGBAFormat:Rn,RGBAIntegerFormat:nh,RGBA_ASTC_10x10_Format:Du,RGBA_ASTC_10x5_Format:Pu,RGBA_ASTC_10x6_Format:Iu,RGBA_ASTC_10x8_Format:Lu,RGBA_ASTC_12x10_Format:Uu,RGBA_ASTC_12x12_Format:Nu,RGBA_ASTC_4x4_Format:Mu,RGBA_ASTC_5x4_Format:wu,RGBA_ASTC_5x5_Format:Eu,RGBA_ASTC_6x5_Format:Au,RGBA_ASTC_6x6_Format:Tu,RGBA_ASTC_8x5_Format:bu,RGBA_ASTC_8x6_Format:Cu,RGBA_ASTC_8x8_Format:Ru,RGBA_BPTC_Format:wa,RGBA_ETC2_EAC_Format:Su,RGBA_PVRTC_2BPPV1_Format:_u,RGBA_PVRTC_4BPPV1_Format:vu,RGBA_S3TC_DXT1_Format:xa,RGBA_S3TC_DXT3_Format:Sa,RGBA_S3TC_DXT5_Format:Ma,RGBDepthPacking:pS,RGBFormat:fp,RGBIntegerFormat:uS,RGB_BPTC_SIGNED_Format:Ou,RGB_BPTC_UNSIGNED_Format:Fu,RGB_ETC1_Format:yu,RGB_ETC2_Format:xu,RGB_PVRTC_2BPPV1_Format:gu,RGB_PVRTC_4BPPV1_Format:mu,RGB_S3TC_DXT1_Format:ya,RGDepthPacking:mS,RGFormat:mp,RGIntegerFormat:th,RawShaderMaterial:ay,Ray:Io,Raycaster:Dy,Rec709Primaries:Ua,RectAreaLight:Ty,RedFormat:eh,RedIntegerFormat:Ja,ReinhardToneMapping:a_,RenderTarget:P_,RepeatWrapping:Ra,ReplaceStencilOp:vS,ReverseSubtractEquation:Vv,RingGeometry:xh,SIGNED_RED_GREEN_RGTC2_Format:ku,SIGNED_RED_RGTC1_Format:Bu,SRGBColorSpace:Wn,SRGBTransfer:zt,Scene:bp,ShaderChunk:pt,ShaderLib:Ei,ShaderMaterial:gi,ShadowMaterial:oy,Shape:Ms,ShapeGeometry:Sh,ShapePath:lC,ShapeUtils:Xi,ShortType:cp,Skeleton:uh,SkeletonHelper:Jb,SkinnedMesh:Y_,Source:gs,Sphere:mn,SphereGeometry:il,Spherical:Xb,SphericalHarmonics3:by,SplineCurve:Op,SpotLight:My,SpotLightHelper:Zb,Sprite:W_,SpriteMaterial:Cp,SrcAlphaFactor:ou,SrcAlphaSaturateFactor:$v,SrcColorFactor:qv,StaticCopyUsage:NS,StaticDrawUsage:Oa,StaticReadUsage:LS,StereoCamera:Eb,StreamCopyUsage:FS,StreamDrawUsage:IS,StreamReadUsage:US,StringKeyframeTrack:Is,SubtractEquation:Hv,SubtractiveBlending:Wd,TOUCH:rS,TangentSpaceNormalMap:zr,TetrahedronGeometry:Mh,Texture:Jt,TextureLoader:gb,TextureUtils:lT,TorusGeometry:wh,TorusKnotGeometry:Eh,Triangle:Xn,TriangleFanDrawMode:dS,TriangleStripDrawMode:fS,TrianglesDrawMode:hS,TubeGeometry:Ah,UVMapping:Ku,Uint16BufferAttribute:Sp,Uint32BufferAttribute:Mp,Uint8BufferAttribute:SM,Uint8ClampedBufferAttribute:MM,Uniform:Jp,UniformsGroup:Gb,UniformsLib:be,UniformsUtils:Vu,UnsignedByteType:Ai,UnsignedInt248Type:As,UnsignedInt5999Type:up,UnsignedIntType:pr,UnsignedShort4444Type:Qu,UnsignedShort5551Type:$u,UnsignedShortType:Eo,VSMShadowMap:wi,Vector2:fe,Vector3:D,Vector4:yt,VectorKeyframeTrack:Wa,VideoTexture:CT,WebGL3DRenderTarget:cM,WebGLArrayRenderTarget:lM,WebGLCoordinateSystem:Vi,WebGLCubeRenderTarget:U_,WebGLMultipleRenderTargets:uC,WebGLRenderTarget:Ti,WebGLRenderer:V_,WebGLUtils:k_,WebGPUCoordinateSystem:Fa,WireframeGeometry:Fp,WrapAroundEnding:La,ZeroCurvatureEnding:ps,ZeroFactor:Xv,ZeroSlopeEnding:ms,ZeroStencilOp:gS,createCanvasElement:C_},Symbol.toStringTag,{value:"Module"}));var Oy={exports:{}},Ls={};/**
 * @license React
 * react-reconciler-constants.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */Ls.ConcurrentRoot=1;Ls.ContinuousEventPriority=4;Ls.DefaultEventPriority=16;Ls.DiscreteEventPriority=1;Ls.IdleEventPriority=536870912;Ls.LegacyRoot=0;Oy.exports=Ls;var Mo=Oy.exports;function fC(r){let e;const t=new Set,n=(h,d)=>{const p=typeof h=="function"?h(e):h;if(p!==e){const m=e;e=d?p:Object.assign({},e,p),t.forEach(g=>g(e,m))}},i=()=>e,s=(h,d=i,p=Object.is)=>{console.warn("[DEPRECATED] Please use `subscribeWithSelector` middleware");let m=d(e);function g(){const y=d(e);if(!p(m,y)){const M=m;h(m=y,M)}}return t.add(g),()=>t.delete(g)},u={setState:n,getState:i,subscribe:(h,d,p)=>d||p?s(h,d,p):(t.add(h),()=>t.delete(h)),destroy:()=>t.clear()};return e=r(n,i,u),u}const dC=typeof window>"u"||!window.navigator||/ServerSideRendering|^Deno\//.test(window.navigator.userAgent),uv=dC?Ee.useEffect:Ee.useLayoutEffect;function pC(r){const e=typeof r=="function"?fC(r):r,t=(n=e.getState,i=Object.is)=>{const[,s]=Ee.useReducer(x=>x+1,0),l=e.getState(),c=Ee.useRef(l),u=Ee.useRef(n),h=Ee.useRef(i),d=Ee.useRef(!1),p=Ee.useRef();p.current===void 0&&(p.current=n(l));let m,g=!1;(c.current!==l||u.current!==n||h.current!==i||d.current)&&(m=n(l),g=!i(p.current,m)),uv(()=>{g&&(p.current=m),c.current=l,u.current=n,h.current=i,d.current=!1});const y=Ee.useRef(l);uv(()=>{const x=()=>{try{const E=e.getState(),w=u.current(E);h.current(p.current,w)||(c.current=E,p.current=w,s())}catch{d.current=!0,s()}},_=e.subscribe(x);return e.getState()!==y.current&&x(),_},[]);const M=g?m:p.current;return Ee.useDebugValue(M),M};return Object.assign(t,e),t[Symbol.iterator]=function(){console.warn("[useStore, api] = create() is deprecated and will be removed in v4");const n=[t,e];return{next(){const i=n.length<=0;return{value:n.shift(),done:i}}}},t}var Fy={exports:{}},Td={exports:{}},bd={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var hv;function mC(){return hv||(hv=1,function(r){function e(F,J){var Z=F.length;F.push(J);e:for(;0<Z;){var ie=Z-1>>>1,xe=F[ie];if(0<i(xe,J))F[ie]=J,F[Z]=xe,Z=ie;else break e}}function t(F){return F.length===0?null:F[0]}function n(F){if(F.length===0)return null;var J=F[0],Z=F.pop();if(Z!==J){F[0]=Z;e:for(var ie=0,xe=F.length,ze=xe>>>1;ie<ze;){var ne=2*(ie+1)-1,de=F[ne],Me=ne+1,ye=F[Me];if(0>i(de,Z))Me<xe&&0>i(ye,de)?(F[ie]=ye,F[Me]=Z,ie=Me):(F[ie]=de,F[ne]=Z,ie=ne);else if(Me<xe&&0>i(ye,Z))F[ie]=ye,F[Me]=Z,ie=Me;else break e}}return J}function i(F,J){var Z=F.sortIndex-J.sortIndex;return Z!==0?Z:F.id-J.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;r.unstable_now=function(){return s.now()}}else{var l=Date,c=l.now();r.unstable_now=function(){return l.now()-c}}var u=[],h=[],d=1,p=null,m=3,g=!1,y=!1,M=!1,x=typeof setTimeout=="function"?setTimeout:null,_=typeof clearTimeout=="function"?clearTimeout:null,E=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function w(F){for(var J=t(h);J!==null;){if(J.callback===null)n(h);else if(J.startTime<=F)n(h),J.sortIndex=J.expirationTime,e(u,J);else break;J=t(h)}}function T(F){if(M=!1,w(F),!y)if(t(u)!==null)y=!0,K(O);else{var J=t(h);J!==null&&me(T,J.startTime-F)}}function O(F,J){y=!1,M&&(M=!1,_(z),z=-1),g=!0;var Z=m;try{for(w(J),p=t(u);p!==null&&(!(p.expirationTime>J)||F&&!C());){var ie=p.callback;if(typeof ie=="function"){p.callback=null,m=p.priorityLevel;var xe=ie(p.expirationTime<=J);J=r.unstable_now(),typeof xe=="function"?p.callback=xe:p===t(u)&&n(u),w(J)}else n(u);p=t(u)}if(p!==null)var ze=!0;else{var ne=t(h);ne!==null&&me(T,ne.startTime-J),ze=!1}return ze}finally{p=null,m=Z,g=!1}}var P=!1,L=null,z=-1,X=5,b=-1;function C(){return!(r.unstable_now()-b<X)}function G(){if(L!==null){var F=r.unstable_now();b=F;var J=!0;try{J=L(!0,F)}finally{J?q():(P=!1,L=null)}}else P=!1}var q;if(typeof E=="function")q=function(){E(G)};else if(typeof MessageChannel<"u"){var Q=new MessageChannel,ae=Q.port2;Q.port1.onmessage=G,q=function(){ae.postMessage(null)}}else q=function(){x(G,0)};function K(F){L=F,P||(P=!0,q())}function me(F,J){z=x(function(){F(r.unstable_now())},J)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(F){F.callback=null},r.unstable_continueExecution=function(){y||g||(y=!0,K(O))},r.unstable_forceFrameRate=function(F){0>F||125<F?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):X=0<F?Math.floor(1e3/F):5},r.unstable_getCurrentPriorityLevel=function(){return m},r.unstable_getFirstCallbackNode=function(){return t(u)},r.unstable_next=function(F){switch(m){case 1:case 2:case 3:var J=3;break;default:J=m}var Z=m;m=J;try{return F()}finally{m=Z}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function(F,J){switch(F){case 1:case 2:case 3:case 4:case 5:break;default:F=3}var Z=m;m=F;try{return J()}finally{m=Z}},r.unstable_scheduleCallback=function(F,J,Z){var ie=r.unstable_now();switch(typeof Z=="object"&&Z!==null?(Z=Z.delay,Z=typeof Z=="number"&&0<Z?ie+Z:ie):Z=ie,F){case 1:var xe=-1;break;case 2:xe=250;break;case 5:xe=1073741823;break;case 4:xe=1e4;break;default:xe=5e3}return xe=Z+xe,F={id:d++,callback:J,priorityLevel:F,startTime:Z,expirationTime:xe,sortIndex:-1},Z>ie?(F.sortIndex=Z,e(h,F),t(u)===null&&F===t(h)&&(M?(_(z),z=-1):M=!0,me(T,Z-ie))):(F.sortIndex=xe,e(u,F),y||g||(y=!0,K(O))),F},r.unstable_shouldYield=C,r.unstable_wrapCallback=function(F){var J=m;return function(){var Z=m;m=J;try{return F.apply(this,arguments)}finally{m=Z}}}}(bd)),bd}var fv;function gC(){return fv||(fv=1,Td.exports=mC()),Td.exports}/**
 * @license React
 * react-reconciler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var vC=function(e){var t={},n=Ee,i=gC(),s=Object.assign;function l(o){for(var a="https://reactjs.org/docs/error-decoder.html?invariant="+o,f=1;f<arguments.length;f++)a+="&args[]="+encodeURIComponent(arguments[f]);return"Minified React error #"+o+"; visit "+a+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var c=n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,u=Symbol.for("react.element"),h=Symbol.for("react.portal"),d=Symbol.for("react.fragment"),p=Symbol.for("react.strict_mode"),m=Symbol.for("react.profiler"),g=Symbol.for("react.provider"),y=Symbol.for("react.context"),M=Symbol.for("react.forward_ref"),x=Symbol.for("react.suspense"),_=Symbol.for("react.suspense_list"),E=Symbol.for("react.memo"),w=Symbol.for("react.lazy"),T=Symbol.for("react.offscreen"),O=Symbol.iterator;function P(o){return o===null||typeof o!="object"?null:(o=O&&o[O]||o["@@iterator"],typeof o=="function"?o:null)}function L(o){if(o==null)return null;if(typeof o=="function")return o.displayName||o.name||null;if(typeof o=="string")return o;switch(o){case d:return"Fragment";case h:return"Portal";case m:return"Profiler";case p:return"StrictMode";case x:return"Suspense";case _:return"SuspenseList"}if(typeof o=="object")switch(o.$$typeof){case y:return(o.displayName||"Context")+".Consumer";case g:return(o._context.displayName||"Context")+".Provider";case M:var a=o.render;return o=o.displayName,o||(o=a.displayName||a.name||"",o=o!==""?"ForwardRef("+o+")":"ForwardRef"),o;case E:return a=o.displayName||null,a!==null?a:L(o.type)||"Memo";case w:a=o._payload,o=o._init;try{return L(o(a))}catch{}}return null}function z(o){var a=o.type;switch(o.tag){case 24:return"Cache";case 9:return(a.displayName||"Context")+".Consumer";case 10:return(a._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return o=a.render,o=o.displayName||o.name||"",a.displayName||(o!==""?"ForwardRef("+o+")":"ForwardRef");case 7:return"Fragment";case 5:return a;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return L(a);case 8:return a===p?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof a=="function")return a.displayName||a.name||null;if(typeof a=="string")return a}return null}function X(o){var a=o,f=o;if(o.alternate)for(;a.return;)a=a.return;else{o=a;do a=o,a.flags&4098&&(f=a.return),o=a.return;while(o)}return a.tag===3?f:null}function b(o){if(X(o)!==o)throw Error(l(188))}function C(o){var a=o.alternate;if(!a){if(a=X(o),a===null)throw Error(l(188));return a!==o?null:o}for(var f=o,v=a;;){var S=f.return;if(S===null)break;var A=S.alternate;if(A===null){if(v=S.return,v!==null){f=v;continue}break}if(S.child===A.child){for(A=S.child;A;){if(A===f)return b(S),o;if(A===v)return b(S),a;A=A.sibling}throw Error(l(188))}if(f.return!==v.return)f=S,v=A;else{for(var B=!1,k=S.child;k;){if(k===f){B=!0,f=S,v=A;break}if(k===v){B=!0,v=S,f=A;break}k=k.sibling}if(!B){for(k=A.child;k;){if(k===f){B=!0,f=A,v=S;break}if(k===v){B=!0,v=A,f=S;break}k=k.sibling}if(!B)throw Error(l(189))}}if(f.alternate!==v)throw Error(l(190))}if(f.tag!==3)throw Error(l(188));return f.stateNode.current===f?o:a}function G(o){return o=C(o),o!==null?q(o):null}function q(o){if(o.tag===5||o.tag===6)return o;for(o=o.child;o!==null;){var a=q(o);if(a!==null)return a;o=o.sibling}return null}function Q(o){if(o.tag===5||o.tag===6)return o;for(o=o.child;o!==null;){if(o.tag!==4){var a=Q(o);if(a!==null)return a}o=o.sibling}return null}var ae=Array.isArray,K=e.getPublicInstance,me=e.getRootHostContext,F=e.getChildHostContext,J=e.prepareForCommit,Z=e.resetAfterCommit,ie=e.createInstance,xe=e.appendInitialChild,ze=e.finalizeInitialChildren,ne=e.prepareUpdate,de=e.shouldSetTextContent,Me=e.createTextInstance,ye=e.scheduleTimeout,rt=e.cancelTimeout,Qe=e.noTimeout,st=e.isPrimaryRenderer,nt=e.supportsMutation,he=e.supportsPersistence,N=e.supportsHydration,Ae=e.getInstanceFromNode,we=e.preparePortalMount,ge=e.getCurrentEventPriority,Te=e.detachDeletedInstance,Je=e.supportsMicrotasks,Ue=e.scheduleMicrotask,U=e.supportsTestSelectors,R=e.findFiberRoot,j=e.getBoundingRect,le=e.getTextContent,ue=e.isHiddenSubtree,ce=e.matchAccessibilityRole,Ye=e.setFocusIfFocusable,Ce=e.setupIntersectionObserver,Fe=e.appendChild,xt=e.appendChildToContainer,ve=e.commitTextUpdate,Be=e.commitMount,ot=e.commitUpdate,at=e.insertBefore,ke=e.insertInContainerBefore,St=e.removeChild,ct=e.removeChildFromContainer,Ut=e.resetTextContent,H=e.hideInstance,Ne=e.hideTextInstance,se=e.unhideInstance,pe=e.unhideTextInstance,Le=e.clearContainer,Oe=e.cloneInstance,Mt=e.createContainerChildSet,Gt=e.appendChildToContainerChildSet,Sn=e.finalizeContainerChildren,wt=e.replaceContainerChildren,gn=e.cloneHiddenInstance,si=e.cloneHiddenTextInstance,al=e.canHydrateInstance,ll=e.canHydrateTextInstance,Zi=e.canHydrateSuspenseInstance,Ds=e.isSuspenseInstancePending,Us=e.isSuspenseInstanceFallback,cl=e.registerSuspenseInstanceRetry,Ri=e.getNextHydratableSibling,ul=e.getFirstHydratableChild,Ns=e.getFirstHydratableChildWithinContainer,hl=e.getFirstHydratableChildWithinSuspenseInstance,fl=e.hydrateInstance,bh=e.hydrateTextInstance,Ch=e.hydrateSuspenseInstance,Rh=e.getNextHydratableInstanceAfterSuspenseInstance,I=e.commitHydratedContainer,V=e.commitHydratedSuspenseInstance,ee=e.clearSuspenseBoundary,te=e.clearSuspenseBoundaryFromContainer,Y=e.shouldDeleteUnhydratedTailInstances,Se=e.didNotMatchHydratedContainerTextInstance,De=e.didNotMatchHydratedTextInstance,He;function Ve(o){if(He===void 0)try{throw Error()}catch(f){var a=f.stack.trim().match(/\n( *(at )?)/);He=a&&a[1]||""}return`
`+He+o}var tt=!1;function it(o,a){if(!o||tt)return"";tt=!0;var f=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(a)if(a=function(){throw Error()},Object.defineProperty(a.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(a,[])}catch(_e){var v=_e}Reflect.construct(o,[],a)}else{try{a.call()}catch(_e){v=_e}o.call(a.prototype)}else{try{throw Error()}catch(_e){v=_e}o()}}catch(_e){if(_e&&v&&typeof _e.stack=="string"){for(var S=_e.stack.split(`
`),A=v.stack.split(`
`),B=S.length-1,k=A.length-1;1<=B&&0<=k&&S[B]!==A[k];)k--;for(;1<=B&&0<=k;B--,k--)if(S[B]!==A[k]){if(B!==1||k!==1)do if(B--,k--,0>k||S[B]!==A[k]){var oe=`
`+S[B].replace(" at new "," at ");return o.displayName&&oe.includes("<anonymous>")&&(oe=oe.replace("<anonymous>",o.displayName)),oe}while(1<=B&&0<=k);break}}}finally{tt=!1,Error.prepareStackTrace=f}return(o=o?o.displayName||o.name:"")?Ve(o):""}var qe=Object.prototype.hasOwnProperty,At=[],Ct=-1;function Dt(o){return{current:o}}function vt(o){0>Ct||(o.current=At[Ct],At[Ct]=null,Ct--)}function Ke(o,a){Ct++,At[Ct]=o.current,o.current=a}var We={},Et=Dt(We),lt=Dt(!1),rn=We;function Jn(o,a){var f=o.type.contextTypes;if(!f)return We;var v=o.stateNode;if(v&&v.__reactInternalMemoizedUnmaskedChildContext===a)return v.__reactInternalMemoizedMaskedChildContext;var S={},A;for(A in f)S[A]=a[A];return v&&(o=o.stateNode,o.__reactInternalMemoizedUnmaskedChildContext=a,o.__reactInternalMemoizedMaskedChildContext=S),S}function Ot(o){return o=o.childContextTypes,o!=null}function vr(){vt(lt),vt(Et)}function Ht(o,a,f){if(Et.current!==We)throw Error(l(168));Ke(Et,a),Ke(lt,f)}function vi(o,a,f){var v=o.stateNode;if(a=a.childContextTypes,typeof v.getChildContext!="function")return f;v=v.getChildContext();for(var S in v)if(!(S in a))throw Error(l(108,z(o)||"Unknown",S));return s({},f,v)}function _r(o){return o=(o=o.stateNode)&&o.__reactInternalMemoizedMergedChildContext||We,rn=Et.current,Ke(Et,o),Ke(lt,lt.current),!0}function In(o,a,f){var v=o.stateNode;if(!v)throw Error(l(169));f?(o=vi(o,a,rn),v.__reactInternalMemoizedMergedChildContext=o,vt(lt),vt(Et),Ke(Et,o)):vt(lt),Ke(lt,f)}var Ln=Math.clz32?Math.clz32:ox,Ph=Math.log,dl=Math.LN2;function ox(o){return o>>>=0,o===0?32:31-(Ph(o)/dl|0)|0}var pl=64,ml=4194304;function Uo(o){switch(o&-o){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return o&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return o&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return o}}function gl(o,a){var f=o.pendingLanes;if(f===0)return 0;var v=0,S=o.suspendedLanes,A=o.pingedLanes,B=f&268435455;if(B!==0){var k=B&~S;k!==0?v=Uo(k):(A&=B,A!==0&&(v=Uo(A)))}else B=f&~S,B!==0?v=Uo(B):A!==0&&(v=Uo(A));if(v===0)return 0;if(a!==0&&a!==v&&!(a&S)&&(S=v&-v,A=a&-a,S>=A||S===16&&(A&4194240)!==0))return a;if(v&4&&(v|=f&16),a=o.entangledLanes,a!==0)for(o=o.entanglements,a&=v;0<a;)f=31-Ln(a),S=1<<f,v|=o[f],a&=~S;return v}function ax(o,a){switch(o){case 1:case 2:case 4:return a+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return a+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function lx(o,a){for(var f=o.suspendedLanes,v=o.pingedLanes,S=o.expirationTimes,A=o.pendingLanes;0<A;){var B=31-Ln(A),k=1<<B,oe=S[B];oe===-1?(!(k&f)||k&v)&&(S[B]=ax(k,a)):oe<=a&&(o.expiredLanes|=k),A&=~k}}function Ih(o){return o=o.pendingLanes&-1073741825,o!==0?o:o&1073741824?1073741824:0}function Lh(o){for(var a=[],f=0;31>f;f++)a.push(o);return a}function No(o,a,f){o.pendingLanes|=a,a!==536870912&&(o.suspendedLanes=0,o.pingedLanes=0),o=o.eventTimes,a=31-Ln(a),o[a]=f}function cx(o,a){var f=o.pendingLanes&~a;o.pendingLanes=a,o.suspendedLanes=0,o.pingedLanes=0,o.expiredLanes&=a,o.mutableReadLanes&=a,o.entangledLanes&=a,a=o.entanglements;var v=o.eventTimes;for(o=o.expirationTimes;0<f;){var S=31-Ln(f),A=1<<S;a[S]=0,v[S]=-1,o[S]=-1,f&=~A}}function Dh(o,a){var f=o.entangledLanes|=a;for(o=o.entanglements;f;){var v=31-Ln(f),S=1<<v;S&a|o[v]&a&&(o[v]|=a),f&=~S}}var Rt=0;function tm(o){return o&=-o,1<o?4<o?o&268435455?16:536870912:4:1}var Uh=i.unstable_scheduleCallback,nm=i.unstable_cancelCallback,ux=i.unstable_shouldYield,hx=i.unstable_requestPaint,ln=i.unstable_now,Nh=i.unstable_ImmediatePriority,fx=i.unstable_UserBlockingPriority,Oh=i.unstable_NormalPriority,dx=i.unstable_IdlePriority,vl=null,Pi=null;function px(o){if(Pi&&typeof Pi.onCommitFiberRoot=="function")try{Pi.onCommitFiberRoot(vl,o,void 0,(o.current.flags&128)===128)}catch{}}function mx(o,a){return o===a&&(o!==0||1/o===1/a)||o!==o&&a!==a}var Ii=typeof Object.is=="function"?Object.is:mx,Ji=null,_l=!1,Fh=!1;function im(o){Ji===null?Ji=[o]:Ji.push(o)}function gx(o){_l=!0,im(o)}function Li(){if(!Fh&&Ji!==null){Fh=!0;var o=0,a=Rt;try{var f=Ji;for(Rt=1;o<f.length;o++){var v=f[o];do v=v(!0);while(v!==null)}Ji=null,_l=!1}catch(S){throw Ji!==null&&(Ji=Ji.slice(o+1)),Uh(Nh,Li),S}finally{Rt=a,Fh=!1}}return null}var vx=c.ReactCurrentBatchConfig;function yl(o,a){if(Ii(o,a))return!0;if(typeof o!="object"||o===null||typeof a!="object"||a===null)return!1;var f=Object.keys(o),v=Object.keys(a);if(f.length!==v.length)return!1;for(v=0;v<f.length;v++){var S=f[v];if(!qe.call(a,S)||!Ii(o[S],a[S]))return!1}return!0}function _x(o){switch(o.tag){case 5:return Ve(o.type);case 16:return Ve("Lazy");case 13:return Ve("Suspense");case 19:return Ve("SuspenseList");case 0:case 2:case 15:return o=it(o.type,!1),o;case 11:return o=it(o.type.render,!1),o;case 1:return o=it(o.type,!0),o;default:return""}}function _i(o,a){if(o&&o.defaultProps){a=s({},a),o=o.defaultProps;for(var f in o)a[f]===void 0&&(a[f]=o[f]);return a}return a}var xl=Dt(null),Sl=null,Os=null,Bh=null;function zh(){Bh=Os=Sl=null}function rm(o,a,f){st?(Ke(xl,a._currentValue),a._currentValue=f):(Ke(xl,a._currentValue2),a._currentValue2=f)}function kh(o){var a=xl.current;vt(xl),st?o._currentValue=a:o._currentValue2=a}function Hh(o,a,f){for(;o!==null;){var v=o.alternate;if((o.childLanes&a)!==a?(o.childLanes|=a,v!==null&&(v.childLanes|=a)):v!==null&&(v.childLanes&a)!==a&&(v.childLanes|=a),o===f)break;o=o.return}}function Fs(o,a){Sl=o,Bh=Os=null,o=o.dependencies,o!==null&&o.firstContext!==null&&(o.lanes&a&&(Qn=!0),o.firstContext=null)}function oi(o){var a=st?o._currentValue:o._currentValue2;if(Bh!==o)if(o={context:o,memoizedValue:a,next:null},Os===null){if(Sl===null)throw Error(l(308));Os=o,Sl.dependencies={lanes:0,firstContext:o}}else Os=Os.next=o;return a}var Di=null,yr=!1;function Vh(o){o.updateQueue={baseState:o.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function sm(o,a){o=o.updateQueue,a.updateQueue===o&&(a.updateQueue={baseState:o.baseState,firstBaseUpdate:o.firstBaseUpdate,lastBaseUpdate:o.lastBaseUpdate,shared:o.shared,effects:o.effects})}function Ki(o,a){return{eventTime:o,lane:a,tag:0,payload:null,callback:null,next:null}}function xr(o,a){var f=o.updateQueue;f!==null&&(f=f.shared,$t!==null&&o.mode&1&&!(_t&2)?(o=f.interleaved,o===null?(a.next=a,Di===null?Di=[f]:Di.push(f)):(a.next=o.next,o.next=a),f.interleaved=a):(o=f.pending,o===null?a.next=a:(a.next=o.next,o.next=a),f.pending=a))}function Ml(o,a,f){if(a=a.updateQueue,a!==null&&(a=a.shared,(f&4194240)!==0)){var v=a.lanes;v&=o.pendingLanes,f|=v,a.lanes=f,Dh(o,f)}}function om(o,a){var f=o.updateQueue,v=o.alternate;if(v!==null&&(v=v.updateQueue,f===v)){var S=null,A=null;if(f=f.firstBaseUpdate,f!==null){do{var B={eventTime:f.eventTime,lane:f.lane,tag:f.tag,payload:f.payload,callback:f.callback,next:null};A===null?S=A=B:A=A.next=B,f=f.next}while(f!==null);A===null?S=A=a:A=A.next=a}else S=A=a;f={baseState:v.baseState,firstBaseUpdate:S,lastBaseUpdate:A,shared:v.shared,effects:v.effects},o.updateQueue=f;return}o=f.lastBaseUpdate,o===null?f.firstBaseUpdate=a:o.next=a,f.lastBaseUpdate=a}function wl(o,a,f,v){var S=o.updateQueue;yr=!1;var A=S.firstBaseUpdate,B=S.lastBaseUpdate,k=S.shared.pending;if(k!==null){S.shared.pending=null;var oe=k,_e=oe.next;oe.next=null,B===null?A=_e:B.next=_e,B=oe;var Ge=o.alternate;Ge!==null&&(Ge=Ge.updateQueue,k=Ge.lastBaseUpdate,k!==B&&(k===null?Ge.firstBaseUpdate=_e:k.next=_e,Ge.lastBaseUpdate=oe))}if(A!==null){var ut=S.baseState;B=0,Ge=_e=oe=null,k=A;do{var $e=k.lane,Ft=k.eventTime;if((v&$e)===$e){Ge!==null&&(Ge=Ge.next={eventTime:Ft,lane:0,tag:k.tag,payload:k.payload,callback:k.callback,next:null});e:{var je=o,An=k;switch($e=a,Ft=f,An.tag){case 1:if(je=An.payload,typeof je=="function"){ut=je.call(Ft,ut,$e);break e}ut=je;break e;case 3:je.flags=je.flags&-65537|128;case 0:if(je=An.payload,$e=typeof je=="function"?je.call(Ft,ut,$e):je,$e==null)break e;ut=s({},ut,$e);break e;case 2:yr=!0}}k.callback!==null&&k.lane!==0&&(o.flags|=64,$e=S.effects,$e===null?S.effects=[k]:$e.push(k))}else Ft={eventTime:Ft,lane:$e,tag:k.tag,payload:k.payload,callback:k.callback,next:null},Ge===null?(_e=Ge=Ft,oe=ut):Ge=Ge.next=Ft,B|=$e;if(k=k.next,k===null){if(k=S.shared.pending,k===null)break;$e=k,k=$e.next,$e.next=null,S.lastBaseUpdate=$e,S.shared.pending=null}}while(!0);if(Ge===null&&(oe=ut),S.baseState=oe,S.firstBaseUpdate=_e,S.lastBaseUpdate=Ge,a=S.shared.interleaved,a!==null){S=a;do B|=S.lane,S=S.next;while(S!==a)}else A===null&&(S.shared.lanes=0);Ys|=B,o.lanes=B,o.memoizedState=ut}}function am(o,a,f){if(o=a.effects,a.effects=null,o!==null)for(a=0;a<o.length;a++){var v=o[a],S=v.callback;if(S!==null){if(v.callback=null,v=f,typeof S!="function")throw Error(l(191,S));S.call(v)}}}var lm=new n.Component().refs;function Gh(o,a,f,v){a=o.memoizedState,f=f(v,a),f=f==null?a:s({},a,f),o.memoizedState=f,o.lanes===0&&(o.updateQueue.baseState=f)}var El={isMounted:function(o){return(o=o._reactInternals)?X(o)===o:!1},enqueueSetState:function(o,a,f){o=o._reactInternals;var v=Un(),S=wr(o),A=Ki(v,S);A.payload=a,f!=null&&(A.callback=f),xr(o,A),a=hi(o,S,v),a!==null&&Ml(a,o,S)},enqueueReplaceState:function(o,a,f){o=o._reactInternals;var v=Un(),S=wr(o),A=Ki(v,S);A.tag=1,A.payload=a,f!=null&&(A.callback=f),xr(o,A),a=hi(o,S,v),a!==null&&Ml(a,o,S)},enqueueForceUpdate:function(o,a){o=o._reactInternals;var f=Un(),v=wr(o),S=Ki(f,v);S.tag=2,a!=null&&(S.callback=a),xr(o,S),a=hi(o,v,f),a!==null&&Ml(a,o,v)}};function cm(o,a,f,v,S,A,B){return o=o.stateNode,typeof o.shouldComponentUpdate=="function"?o.shouldComponentUpdate(v,A,B):a.prototype&&a.prototype.isPureReactComponent?!yl(f,v)||!yl(S,A):!0}function um(o,a,f){var v=!1,S=We,A=a.contextType;return typeof A=="object"&&A!==null?A=oi(A):(S=Ot(a)?rn:Et.current,v=a.contextTypes,A=(v=v!=null)?Jn(o,S):We),a=new a(f,A),o.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,a.updater=El,o.stateNode=a,a._reactInternals=o,v&&(o=o.stateNode,o.__reactInternalMemoizedUnmaskedChildContext=S,o.__reactInternalMemoizedMaskedChildContext=A),a}function hm(o,a,f,v){o=a.state,typeof a.componentWillReceiveProps=="function"&&a.componentWillReceiveProps(f,v),typeof a.UNSAFE_componentWillReceiveProps=="function"&&a.UNSAFE_componentWillReceiveProps(f,v),a.state!==o&&El.enqueueReplaceState(a,a.state,null)}function Wh(o,a,f,v){var S=o.stateNode;S.props=f,S.state=o.memoizedState,S.refs=lm,Vh(o);var A=a.contextType;typeof A=="object"&&A!==null?S.context=oi(A):(A=Ot(a)?rn:Et.current,S.context=Jn(o,A)),S.state=o.memoizedState,A=a.getDerivedStateFromProps,typeof A=="function"&&(Gh(o,a,A,f),S.state=o.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof S.getSnapshotBeforeUpdate=="function"||typeof S.UNSAFE_componentWillMount!="function"&&typeof S.componentWillMount!="function"||(a=S.state,typeof S.componentWillMount=="function"&&S.componentWillMount(),typeof S.UNSAFE_componentWillMount=="function"&&S.UNSAFE_componentWillMount(),a!==S.state&&El.enqueueReplaceState(S,S.state,null),wl(o,f,S,v),S.state=o.memoizedState),typeof S.componentDidMount=="function"&&(o.flags|=4194308)}var Bs=[],zs=0,Al=null,Tl=0,ai=[],li=0,Gr=null,ji=1,Qi="";function Wr(o,a){Bs[zs++]=Tl,Bs[zs++]=Al,Al=o,Tl=a}function fm(o,a,f){ai[li++]=ji,ai[li++]=Qi,ai[li++]=Gr,Gr=o;var v=ji;o=Qi;var S=32-Ln(v)-1;v&=~(1<<S),f+=1;var A=32-Ln(a)+S;if(30<A){var B=S-S%5;A=(v&(1<<B)-1).toString(32),v>>=B,S-=B,ji=1<<32-Ln(a)+S|f<<S|v,Qi=A+o}else ji=1<<A|f<<S|v,Qi=o}function Xh(o){o.return!==null&&(Wr(o,1),fm(o,1,0))}function Yh(o){for(;o===Al;)Al=Bs[--zs],Bs[zs]=null,Tl=Bs[--zs],Bs[zs]=null;for(;o===Gr;)Gr=ai[--li],ai[li]=null,Qi=ai[--li],ai[li]=null,ji=ai[--li],ai[li]=null}var Kn=null,jn=null,Vt=!1,Oo=!1,yi=null;function dm(o,a){var f=fi(5,null,null,0);f.elementType="DELETED",f.stateNode=a,f.return=o,a=o.deletions,a===null?(o.deletions=[f],o.flags|=16):a.push(f)}function pm(o,a){switch(o.tag){case 5:return a=al(a,o.type,o.pendingProps),a!==null?(o.stateNode=a,Kn=o,jn=ul(a),!0):!1;case 6:return a=ll(a,o.pendingProps),a!==null?(o.stateNode=a,Kn=o,jn=null,!0):!1;case 13:if(a=Zi(a),a!==null){var f=Gr!==null?{id:ji,overflow:Qi}:null;return o.memoizedState={dehydrated:a,treeContext:f,retryLane:1073741824},f=fi(18,null,null,0),f.stateNode=a,f.return=o,o.child=f,Kn=o,jn=null,!0}return!1;default:return!1}}function qh(o){return(o.mode&1)!==0&&(o.flags&128)===0}function Zh(o){if(Vt){var a=jn;if(a){var f=a;if(!pm(o,a)){if(qh(o))throw Error(l(418));a=Ri(f);var v=Kn;a&&pm(o,a)?dm(v,f):(o.flags=o.flags&-4097|2,Vt=!1,Kn=o)}}else{if(qh(o))throw Error(l(418));o.flags=o.flags&-4097|2,Vt=!1,Kn=o}}}function mm(o){for(o=o.return;o!==null&&o.tag!==5&&o.tag!==3&&o.tag!==13;)o=o.return;Kn=o}function Fo(o){if(!N||o!==Kn)return!1;if(!Vt)return mm(o),Vt=!0,!1;if(o.tag!==3&&(o.tag!==5||Y(o.type)&&!de(o.type,o.memoizedProps))){var a=jn;if(a){if(qh(o)){for(o=jn;o;)o=Ri(o);throw Error(l(418))}for(;a;)dm(o,a),a=Ri(a)}}if(mm(o),o.tag===13){if(!N)throw Error(l(316));if(o=o.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(l(317));jn=Rh(o)}else jn=Kn?Ri(o.stateNode):null;return!0}function ks(){N&&(jn=Kn=null,Oo=Vt=!1)}function Jh(o){yi===null?yi=[o]:yi.push(o)}function Bo(o,a,f){if(o=f.ref,o!==null&&typeof o!="function"&&typeof o!="object"){if(f._owner){if(f=f._owner,f){if(f.tag!==1)throw Error(l(309));var v=f.stateNode}if(!v)throw Error(l(147,o));var S=v,A=""+o;return a!==null&&a.ref!==null&&typeof a.ref=="function"&&a.ref._stringRef===A?a.ref:(a=function(B){var k=S.refs;k===lm&&(k=S.refs={}),B===null?delete k[A]:k[A]=B},a._stringRef=A,a)}if(typeof o!="string")throw Error(l(284));if(!f._owner)throw Error(l(290,o))}return o}function bl(o,a){throw o=Object.prototype.toString.call(a),Error(l(31,o==="[object Object]"?"object with keys {"+Object.keys(a).join(", ")+"}":o))}function gm(o){var a=o._init;return a(o._payload)}function vm(o){function a($,W){if(o){var re=$.deletions;re===null?($.deletions=[W],$.flags|=16):re.push(W)}}function f($,W){if(!o)return null;for(;W!==null;)a($,W),W=W.sibling;return null}function v($,W){for($=new Map;W!==null;)W.key!==null?$.set(W.key,W):$.set(W.index,W),W=W.sibling;return $}function S($,W){return $=Ar($,W),$.index=0,$.sibling=null,$}function A($,W,re){return $.index=re,o?(re=$.alternate,re!==null?(re=re.index,re<W?($.flags|=2,W):re):($.flags|=2,W)):($.flags|=1048576,W)}function B($){return o&&$.alternate===null&&($.flags|=2),$}function k($,W,re,Pe){return W===null||W.tag!==6?(W=Df(re,$.mode,Pe),W.return=$,W):(W=S(W,re),W.return=$,W)}function oe($,W,re,Pe){var Ze=re.type;return Ze===d?Ge($,W,re.props.children,Pe,re.key):W!==null&&(W.elementType===Ze||typeof Ze=="object"&&Ze!==null&&Ze.$$typeof===w&&gm(Ze)===W.type)?(Pe=S(W,re.props),Pe.ref=Bo($,W,re),Pe.return=$,Pe):(Pe=rc(re.type,re.key,re.props,null,$.mode,Pe),Pe.ref=Bo($,W,re),Pe.return=$,Pe)}function _e($,W,re,Pe){return W===null||W.tag!==4||W.stateNode.containerInfo!==re.containerInfo||W.stateNode.implementation!==re.implementation?(W=Uf(re,$.mode,Pe),W.return=$,W):(W=S(W,re.children||[]),W.return=$,W)}function Ge($,W,re,Pe,Ze){return W===null||W.tag!==7?(W=jr(re,$.mode,Pe,Ze),W.return=$,W):(W=S(W,re),W.return=$,W)}function ut($,W,re){if(typeof W=="string"&&W!==""||typeof W=="number")return W=Df(""+W,$.mode,re),W.return=$,W;if(typeof W=="object"&&W!==null){switch(W.$$typeof){case u:return re=rc(W.type,W.key,W.props,null,$.mode,re),re.ref=Bo($,null,W),re.return=$,re;case h:return W=Uf(W,$.mode,re),W.return=$,W;case w:var Pe=W._init;return ut($,Pe(W._payload),re)}if(ae(W)||P(W))return W=jr(W,$.mode,re,null),W.return=$,W;bl($,W)}return null}function $e($,W,re,Pe){var Ze=W!==null?W.key:null;if(typeof re=="string"&&re!==""||typeof re=="number")return Ze!==null?null:k($,W,""+re,Pe);if(typeof re=="object"&&re!==null){switch(re.$$typeof){case u:return re.key===Ze?oe($,W,re,Pe):null;case h:return re.key===Ze?_e($,W,re,Pe):null;case w:return Ze=re._init,$e($,W,Ze(re._payload),Pe)}if(ae(re)||P(re))return Ze!==null?null:Ge($,W,re,Pe,null);bl($,re)}return null}function Ft($,W,re,Pe,Ze){if(typeof Pe=="string"&&Pe!==""||typeof Pe=="number")return $=$.get(re)||null,k(W,$,""+Pe,Ze);if(typeof Pe=="object"&&Pe!==null){switch(Pe.$$typeof){case u:return $=$.get(Pe.key===null?re:Pe.key)||null,oe(W,$,Pe,Ze);case h:return $=$.get(Pe.key===null?re:Pe.key)||null,_e(W,$,Pe,Ze);case w:var mt=Pe._init;return Ft($,W,re,mt(Pe._payload),Ze)}if(ae(Pe)||P(Pe))return $=$.get(re)||null,Ge(W,$,Pe,Ze,null);bl(W,Pe)}return null}function je($,W,re,Pe){for(var Ze=null,mt=null,ht=W,Pt=W=0,un=null;ht!==null&&Pt<re.length;Pt++){ht.index>Pt?(un=ht,ht=null):un=ht.sibling;var It=$e($,ht,re[Pt],Pe);if(It===null){ht===null&&(ht=un);break}o&&ht&&It.alternate===null&&a($,ht),W=A(It,W,Pt),mt===null?Ze=It:mt.sibling=It,mt=It,ht=un}if(Pt===re.length)return f($,ht),Vt&&Wr($,Pt),Ze;if(ht===null){for(;Pt<re.length;Pt++)ht=ut($,re[Pt],Pe),ht!==null&&(W=A(ht,W,Pt),mt===null?Ze=ht:mt.sibling=ht,mt=ht);return Vt&&Wr($,Pt),Ze}for(ht=v($,ht);Pt<re.length;Pt++)un=Ft(ht,$,Pt,re[Pt],Pe),un!==null&&(o&&un.alternate!==null&&ht.delete(un.key===null?Pt:un.key),W=A(un,W,Pt),mt===null?Ze=un:mt.sibling=un,mt=un);return o&&ht.forEach(function(Tr){return a($,Tr)}),Vt&&Wr($,Pt),Ze}function An($,W,re,Pe){var Ze=P(re);if(typeof Ze!="function")throw Error(l(150));if(re=Ze.call(re),re==null)throw Error(l(151));for(var mt=Ze=null,ht=W,Pt=W=0,un=null,It=re.next();ht!==null&&!It.done;Pt++,It=re.next()){ht.index>Pt?(un=ht,ht=null):un=ht.sibling;var Tr=$e($,ht,It.value,Pe);if(Tr===null){ht===null&&(ht=un);break}o&&ht&&Tr.alternate===null&&a($,ht),W=A(Tr,W,Pt),mt===null?Ze=Tr:mt.sibling=Tr,mt=Tr,ht=un}if(It.done)return f($,ht),Vt&&Wr($,Pt),Ze;if(ht===null){for(;!It.done;Pt++,It=re.next())It=ut($,It.value,Pe),It!==null&&(W=A(It,W,Pt),mt===null?Ze=It:mt.sibling=It,mt=It);return Vt&&Wr($,Pt),Ze}for(ht=v($,ht);!It.done;Pt++,It=re.next())It=Ft(ht,$,Pt,It.value,Pe),It!==null&&(o&&It.alternate!==null&&ht.delete(It.key===null?Pt:It.key),W=A(It,W,Pt),mt===null?Ze=It:mt.sibling=It,mt=It);return o&&ht.forEach(function(Zx){return a($,Zx)}),Vt&&Wr($,Pt),Ze}function di($,W,re,Pe){if(typeof re=="object"&&re!==null&&re.type===d&&re.key===null&&(re=re.props.children),typeof re=="object"&&re!==null){switch(re.$$typeof){case u:e:{for(var Ze=re.key,mt=W;mt!==null;){if(mt.key===Ze){if(Ze=re.type,Ze===d){if(mt.tag===7){f($,mt.sibling),W=S(mt,re.props.children),W.return=$,$=W;break e}}else if(mt.elementType===Ze||typeof Ze=="object"&&Ze!==null&&Ze.$$typeof===w&&gm(Ze)===mt.type){f($,mt.sibling),W=S(mt,re.props),W.ref=Bo($,mt,re),W.return=$,$=W;break e}f($,mt);break}else a($,mt);mt=mt.sibling}re.type===d?(W=jr(re.props.children,$.mode,Pe,re.key),W.return=$,$=W):(Pe=rc(re.type,re.key,re.props,null,$.mode,Pe),Pe.ref=Bo($,W,re),Pe.return=$,$=Pe)}return B($);case h:e:{for(mt=re.key;W!==null;){if(W.key===mt)if(W.tag===4&&W.stateNode.containerInfo===re.containerInfo&&W.stateNode.implementation===re.implementation){f($,W.sibling),W=S(W,re.children||[]),W.return=$,$=W;break e}else{f($,W);break}else a($,W);W=W.sibling}W=Uf(re,$.mode,Pe),W.return=$,$=W}return B($);case w:return mt=re._init,di($,W,mt(re._payload),Pe)}if(ae(re))return je($,W,re,Pe);if(P(re))return An($,W,re,Pe);bl($,re)}return typeof re=="string"&&re!==""||typeof re=="number"?(re=""+re,W!==null&&W.tag===6?(f($,W.sibling),W=S(W,re),W.return=$,$=W):(f($,W),W=Df(re,$.mode,Pe),W.return=$,$=W),B($)):f($,W)}return di}var Hs=vm(!0),_m=vm(!1),zo={},ci=Dt(zo),ko=Dt(zo),Vs=Dt(zo);function Ui(o){if(o===zo)throw Error(l(174));return o}function Kh(o,a){Ke(Vs,a),Ke(ko,o),Ke(ci,zo),o=me(a),vt(ci),Ke(ci,o)}function Gs(){vt(ci),vt(ko),vt(Vs)}function ym(o){var a=Ui(Vs.current),f=Ui(ci.current);a=F(f,o.type,a),f!==a&&(Ke(ko,o),Ke(ci,a))}function jh(o){ko.current===o&&(vt(ci),vt(ko))}var Wt=Dt(0);function Cl(o){for(var a=o;a!==null;){if(a.tag===13){var f=a.memoizedState;if(f!==null&&(f=f.dehydrated,f===null||Ds(f)||Us(f)))return a}else if(a.tag===19&&a.memoizedProps.revealOrder!==void 0){if(a.flags&128)return a}else if(a.child!==null){a.child.return=a,a=a.child;continue}if(a===o)break;for(;a.sibling===null;){if(a.return===null||a.return===o)return null;a=a.return}a.sibling.return=a.return,a=a.sibling}return null}var Qh=[];function $h(){for(var o=0;o<Qh.length;o++){var a=Qh[o];st?a._workInProgressVersionPrimary=null:a._workInProgressVersionSecondary=null}Qh.length=0}var Rl=c.ReactCurrentDispatcher,ui=c.ReactCurrentBatchConfig,Ws=0,Yt=null,Mn=null,cn=null,Pl=!1,Ho=!1,Vo=0,yx=0;function wn(){throw Error(l(321))}function ef(o,a){if(a===null)return!1;for(var f=0;f<a.length&&f<o.length;f++)if(!Ii(o[f],a[f]))return!1;return!0}function tf(o,a,f,v,S,A){if(Ws=A,Yt=a,a.memoizedState=null,a.updateQueue=null,a.lanes=0,Rl.current=o===null||o.memoizedState===null?wx:Ex,o=f(v,S),Ho){A=0;do{if(Ho=!1,Vo=0,25<=A)throw Error(l(301));A+=1,cn=Mn=null,a.updateQueue=null,Rl.current=Ax,o=f(v,S)}while(Ho)}if(Rl.current=Nl,a=Mn!==null&&Mn.next!==null,Ws=0,cn=Mn=Yt=null,Pl=!1,a)throw Error(l(300));return o}function nf(){var o=Vo!==0;return Vo=0,o}function $i(){var o={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return cn===null?Yt.memoizedState=cn=o:cn=cn.next=o,cn}function Ni(){if(Mn===null){var o=Yt.alternate;o=o!==null?o.memoizedState:null}else o=Mn.next;var a=cn===null?Yt.memoizedState:cn.next;if(a!==null)cn=a,Mn=o;else{if(o===null)throw Error(l(310));Mn=o,o={memoizedState:Mn.memoizedState,baseState:Mn.baseState,baseQueue:Mn.baseQueue,queue:Mn.queue,next:null},cn===null?Yt.memoizedState=cn=o:cn=cn.next=o}return cn}function Xr(o,a){return typeof a=="function"?a(o):a}function Il(o){var a=Ni(),f=a.queue;if(f===null)throw Error(l(311));f.lastRenderedReducer=o;var v=Mn,S=v.baseQueue,A=f.pending;if(A!==null){if(S!==null){var B=S.next;S.next=A.next,A.next=B}v.baseQueue=S=A,f.pending=null}if(S!==null){A=S.next,v=v.baseState;var k=B=null,oe=null,_e=A;do{var Ge=_e.lane;if((Ws&Ge)===Ge)oe!==null&&(oe=oe.next={lane:0,action:_e.action,hasEagerState:_e.hasEagerState,eagerState:_e.eagerState,next:null}),v=_e.hasEagerState?_e.eagerState:o(v,_e.action);else{var ut={lane:Ge,action:_e.action,hasEagerState:_e.hasEagerState,eagerState:_e.eagerState,next:null};oe===null?(k=oe=ut,B=v):oe=oe.next=ut,Yt.lanes|=Ge,Ys|=Ge}_e=_e.next}while(_e!==null&&_e!==A);oe===null?B=v:oe.next=k,Ii(v,a.memoizedState)||(Qn=!0),a.memoizedState=v,a.baseState=B,a.baseQueue=oe,f.lastRenderedState=v}if(o=f.interleaved,o!==null){S=o;do A=S.lane,Yt.lanes|=A,Ys|=A,S=S.next;while(S!==o)}else S===null&&(f.lanes=0);return[a.memoizedState,f.dispatch]}function Ll(o){var a=Ni(),f=a.queue;if(f===null)throw Error(l(311));f.lastRenderedReducer=o;var v=f.dispatch,S=f.pending,A=a.memoizedState;if(S!==null){f.pending=null;var B=S=S.next;do A=o(A,B.action),B=B.next;while(B!==S);Ii(A,a.memoizedState)||(Qn=!0),a.memoizedState=A,a.baseQueue===null&&(a.baseState=A),f.lastRenderedState=A}return[A,v]}function xm(){}function Sm(o,a){var f=Yt,v=Ni(),S=a(),A=!Ii(v.memoizedState,S);if(A&&(v.memoizedState=S,Qn=!0),v=v.queue,Wo(Em.bind(null,f,v,o),[o]),v.getSnapshot!==a||A||cn!==null&&cn.memoizedState.tag&1){if(f.flags|=2048,Go(9,wm.bind(null,f,v,S,a),void 0,null),$t===null)throw Error(l(349));Ws&30||Mm(f,a,S)}return S}function Mm(o,a,f){o.flags|=16384,o={getSnapshot:a,value:f},a=Yt.updateQueue,a===null?(a={lastEffect:null,stores:null},Yt.updateQueue=a,a.stores=[o]):(f=a.stores,f===null?a.stores=[o]:f.push(o))}function wm(o,a,f,v){a.value=f,a.getSnapshot=v,Am(a)&&hi(o,1,-1)}function Em(o,a,f){return f(function(){Am(a)&&hi(o,1,-1)})}function Am(o){var a=o.getSnapshot;o=o.value;try{var f=a();return!Ii(o,f)}catch{return!0}}function rf(o){var a=$i();return typeof o=="function"&&(o=o()),a.memoizedState=a.baseState=o,o={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Xr,lastRenderedState:o},a.queue=o,o=o.dispatch=Mx.bind(null,Yt,o),[a.memoizedState,o]}function Go(o,a,f,v){return o={tag:o,create:a,destroy:f,deps:v,next:null},a=Yt.updateQueue,a===null?(a={lastEffect:null,stores:null},Yt.updateQueue=a,a.lastEffect=o.next=o):(f=a.lastEffect,f===null?a.lastEffect=o.next=o:(v=f.next,f.next=o,o.next=v,a.lastEffect=o)),o}function Tm(){return Ni().memoizedState}function Dl(o,a,f,v){var S=$i();Yt.flags|=o,S.memoizedState=Go(1|a,f,void 0,v===void 0?null:v)}function Ul(o,a,f,v){var S=Ni();v=v===void 0?null:v;var A=void 0;if(Mn!==null){var B=Mn.memoizedState;if(A=B.destroy,v!==null&&ef(v,B.deps)){S.memoizedState=Go(a,f,A,v);return}}Yt.flags|=o,S.memoizedState=Go(1|a,f,A,v)}function sf(o,a){return Dl(8390656,8,o,a)}function Wo(o,a){return Ul(2048,8,o,a)}function bm(o,a){return Ul(4,2,o,a)}function Cm(o,a){return Ul(4,4,o,a)}function Rm(o,a){if(typeof a=="function")return o=o(),a(o),function(){a(null)};if(a!=null)return o=o(),a.current=o,function(){a.current=null}}function Pm(o,a,f){return f=f!=null?f.concat([o]):null,Ul(4,4,Rm.bind(null,a,o),f)}function of(){}function Im(o,a){var f=Ni();a=a===void 0?null:a;var v=f.memoizedState;return v!==null&&a!==null&&ef(a,v[1])?v[0]:(f.memoizedState=[o,a],o)}function Lm(o,a){var f=Ni();a=a===void 0?null:a;var v=f.memoizedState;return v!==null&&a!==null&&ef(a,v[1])?v[0]:(o=o(),f.memoizedState=[o,a],o)}function xx(o,a){var f=Rt;Rt=f!==0&&4>f?f:4,o(!0);var v=ui.transition;ui.transition={};try{o(!1),a()}finally{Rt=f,ui.transition=v}}function Dm(){return Ni().memoizedState}function Sx(o,a,f){var v=wr(o);f={lane:v,action:f,hasEagerState:!1,eagerState:null,next:null},Um(o)?Nm(a,f):(Om(o,a,f),f=Un(),o=hi(o,v,f),o!==null&&Fm(o,a,v))}function Mx(o,a,f){var v=wr(o),S={lane:v,action:f,hasEagerState:!1,eagerState:null,next:null};if(Um(o))Nm(a,S);else{Om(o,a,S);var A=o.alternate;if(o.lanes===0&&(A===null||A.lanes===0)&&(A=a.lastRenderedReducer,A!==null))try{var B=a.lastRenderedState,k=A(B,f);if(S.hasEagerState=!0,S.eagerState=k,Ii(k,B))return}catch{}finally{}f=Un(),o=hi(o,v,f),o!==null&&Fm(o,a,v)}}function Um(o){var a=o.alternate;return o===Yt||a!==null&&a===Yt}function Nm(o,a){Ho=Pl=!0;var f=o.pending;f===null?a.next=a:(a.next=f.next,f.next=a),o.pending=a}function Om(o,a,f){$t!==null&&o.mode&1&&!(_t&2)?(o=a.interleaved,o===null?(f.next=f,Di===null?Di=[a]:Di.push(a)):(f.next=o.next,o.next=f),a.interleaved=f):(o=a.pending,o===null?f.next=f:(f.next=o.next,o.next=f),a.pending=f)}function Fm(o,a,f){if(f&4194240){var v=a.lanes;v&=o.pendingLanes,f|=v,a.lanes=f,Dh(o,f)}}var Nl={readContext:oi,useCallback:wn,useContext:wn,useEffect:wn,useImperativeHandle:wn,useInsertionEffect:wn,useLayoutEffect:wn,useMemo:wn,useReducer:wn,useRef:wn,useState:wn,useDebugValue:wn,useDeferredValue:wn,useTransition:wn,useMutableSource:wn,useSyncExternalStore:wn,useId:wn,unstable_isNewReconciler:!1},wx={readContext:oi,useCallback:function(o,a){return $i().memoizedState=[o,a===void 0?null:a],o},useContext:oi,useEffect:sf,useImperativeHandle:function(o,a,f){return f=f!=null?f.concat([o]):null,Dl(4194308,4,Rm.bind(null,a,o),f)},useLayoutEffect:function(o,a){return Dl(4194308,4,o,a)},useInsertionEffect:function(o,a){return Dl(4,2,o,a)},useMemo:function(o,a){var f=$i();return a=a===void 0?null:a,o=o(),f.memoizedState=[o,a],o},useReducer:function(o,a,f){var v=$i();return a=f!==void 0?f(a):a,v.memoizedState=v.baseState=a,o={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:o,lastRenderedState:a},v.queue=o,o=o.dispatch=Sx.bind(null,Yt,o),[v.memoizedState,o]},useRef:function(o){var a=$i();return o={current:o},a.memoizedState=o},useState:rf,useDebugValue:of,useDeferredValue:function(o){var a=rf(o),f=a[0],v=a[1];return sf(function(){var S=ui.transition;ui.transition={};try{v(o)}finally{ui.transition=S}},[o]),f},useTransition:function(){var o=rf(!1),a=o[0];return o=xx.bind(null,o[1]),$i().memoizedState=o,[a,o]},useMutableSource:function(){},useSyncExternalStore:function(o,a,f){var v=Yt,S=$i();if(Vt){if(f===void 0)throw Error(l(407));f=f()}else{if(f=a(),$t===null)throw Error(l(349));Ws&30||Mm(v,a,f)}S.memoizedState=f;var A={value:f,getSnapshot:a};return S.queue=A,sf(Em.bind(null,v,A,o),[o]),v.flags|=2048,Go(9,wm.bind(null,v,A,f,a),void 0,null),f},useId:function(){var o=$i(),a=$t.identifierPrefix;if(Vt){var f=Qi,v=ji;f=(v&~(1<<32-Ln(v)-1)).toString(32)+f,a=":"+a+"R"+f,f=Vo++,0<f&&(a+="H"+f.toString(32)),a+=":"}else f=yx++,a=":"+a+"r"+f.toString(32)+":";return o.memoizedState=a},unstable_isNewReconciler:!1},Ex={readContext:oi,useCallback:Im,useContext:oi,useEffect:Wo,useImperativeHandle:Pm,useInsertionEffect:bm,useLayoutEffect:Cm,useMemo:Lm,useReducer:Il,useRef:Tm,useState:function(){return Il(Xr)},useDebugValue:of,useDeferredValue:function(o){var a=Il(Xr),f=a[0],v=a[1];return Wo(function(){var S=ui.transition;ui.transition={};try{v(o)}finally{ui.transition=S}},[o]),f},useTransition:function(){var o=Il(Xr)[0],a=Ni().memoizedState;return[o,a]},useMutableSource:xm,useSyncExternalStore:Sm,useId:Dm,unstable_isNewReconciler:!1},Ax={readContext:oi,useCallback:Im,useContext:oi,useEffect:Wo,useImperativeHandle:Pm,useInsertionEffect:bm,useLayoutEffect:Cm,useMemo:Lm,useReducer:Ll,useRef:Tm,useState:function(){return Ll(Xr)},useDebugValue:of,useDeferredValue:function(o){var a=Ll(Xr),f=a[0],v=a[1];return Wo(function(){var S=ui.transition;ui.transition={};try{v(o)}finally{ui.transition=S}},[o]),f},useTransition:function(){var o=Ll(Xr)[0],a=Ni().memoizedState;return[o,a]},useMutableSource:xm,useSyncExternalStore:Sm,useId:Dm,unstable_isNewReconciler:!1};function af(o,a){try{var f="",v=a;do f+=_x(v),v=v.return;while(v);var S=f}catch(A){S=`
Error generating stack: `+A.message+`
`+A.stack}return{value:o,source:a,stack:S}}function lf(o,a){try{console.error(a.value)}catch(f){setTimeout(function(){throw f})}}var Tx=typeof WeakMap=="function"?WeakMap:Map;function Bm(o,a,f){f=Ki(-1,f),f.tag=3,f.payload={element:null};var v=a.value;return f.callback=function(){jl||(jl=!0,Tf=v),lf(o,a)},f}function zm(o,a,f){f=Ki(-1,f),f.tag=3;var v=o.type.getDerivedStateFromError;if(typeof v=="function"){var S=a.value;f.payload=function(){return v(S)},f.callback=function(){lf(o,a)}}var A=o.stateNode;return A!==null&&typeof A.componentDidCatch=="function"&&(f.callback=function(){lf(o,a),typeof v!="function"&&(Sr===null?Sr=new Set([this]):Sr.add(this));var B=a.stack;this.componentDidCatch(a.value,{componentStack:B!==null?B:""})}),f}function km(o,a,f){var v=o.pingCache;if(v===null){v=o.pingCache=new Tx;var S=new Set;v.set(a,S)}else S=v.get(a),S===void 0&&(S=new Set,v.set(a,S));S.has(f)||(S.add(f),o=kx.bind(null,o,a,f),a.then(o,o))}function Hm(o){do{var a;if((a=o.tag===13)&&(a=o.memoizedState,a=a!==null?a.dehydrated!==null:!0),a)return o;o=o.return}while(o!==null);return null}function Vm(o,a,f,v,S){return o.mode&1?(o.flags|=65536,o.lanes=S,o):(o===a?o.flags|=65536:(o.flags|=128,f.flags|=131072,f.flags&=-52805,f.tag===1&&(f.alternate===null?f.tag=17:(a=Ki(-1,1),a.tag=2,xr(f,a))),f.lanes|=1),o)}function Oi(o){o.flags|=4}function Gm(o,a){if(o!==null&&o.child===a.child)return!0;if(a.flags&16)return!1;for(o=a.child;o!==null;){if(o.flags&12854||o.subtreeFlags&12854)return!1;o=o.sibling}return!0}var Xo,Yo,Ol,Fl;if(nt)Xo=function(o,a){for(var f=a.child;f!==null;){if(f.tag===5||f.tag===6)xe(o,f.stateNode);else if(f.tag!==4&&f.child!==null){f.child.return=f,f=f.child;continue}if(f===a)break;for(;f.sibling===null;){if(f.return===null||f.return===a)return;f=f.return}f.sibling.return=f.return,f=f.sibling}},Yo=function(){},Ol=function(o,a,f,v,S){if(o=o.memoizedProps,o!==v){var A=a.stateNode,B=Ui(ci.current);f=ne(A,f,o,v,S,B),(a.updateQueue=f)&&Oi(a)}},Fl=function(o,a,f,v){f!==v&&Oi(a)};else if(he){Xo=function(o,a,f,v){for(var S=a.child;S!==null;){if(S.tag===5){var A=S.stateNode;f&&v&&(A=gn(A,S.type,S.memoizedProps,S)),xe(o,A)}else if(S.tag===6)A=S.stateNode,f&&v&&(A=si(A,S.memoizedProps,S)),xe(o,A);else if(S.tag!==4){if(S.tag===22&&S.memoizedState!==null)A=S.child,A!==null&&(A.return=S),Xo(o,S,!0,!0);else if(S.child!==null){S.child.return=S,S=S.child;continue}}if(S===a)break;for(;S.sibling===null;){if(S.return===null||S.return===a)return;S=S.return}S.sibling.return=S.return,S=S.sibling}};var Wm=function(o,a,f,v){for(var S=a.child;S!==null;){if(S.tag===5){var A=S.stateNode;f&&v&&(A=gn(A,S.type,S.memoizedProps,S)),Gt(o,A)}else if(S.tag===6)A=S.stateNode,f&&v&&(A=si(A,S.memoizedProps,S)),Gt(o,A);else if(S.tag!==4){if(S.tag===22&&S.memoizedState!==null)A=S.child,A!==null&&(A.return=S),Wm(o,S,!0,!0);else if(S.child!==null){S.child.return=S,S=S.child;continue}}if(S===a)break;for(;S.sibling===null;){if(S.return===null||S.return===a)return;S=S.return}S.sibling.return=S.return,S=S.sibling}};Yo=function(o,a){var f=a.stateNode;if(!Gm(o,a)){o=f.containerInfo;var v=Mt(o);Wm(v,a,!1,!1),f.pendingChildren=v,Oi(a),Sn(o,v)}},Ol=function(o,a,f,v,S){var A=o.stateNode,B=o.memoizedProps;if((o=Gm(o,a))&&B===v)a.stateNode=A;else{var k=a.stateNode,oe=Ui(ci.current),_e=null;B!==v&&(_e=ne(k,f,B,v,S,oe)),o&&_e===null?a.stateNode=A:(A=Oe(A,_e,f,B,v,a,o,k),ze(A,f,v,S,oe)&&Oi(a),a.stateNode=A,o?Oi(a):Xo(A,a,!1,!1))}},Fl=function(o,a,f,v){f!==v?(o=Ui(Vs.current),f=Ui(ci.current),a.stateNode=Me(v,o,f,a),Oi(a)):a.stateNode=o.stateNode}}else Yo=function(){},Ol=function(){},Fl=function(){};function qo(o,a){if(!Vt)switch(o.tailMode){case"hidden":a=o.tail;for(var f=null;a!==null;)a.alternate!==null&&(f=a),a=a.sibling;f===null?o.tail=null:f.sibling=null;break;case"collapsed":f=o.tail;for(var v=null;f!==null;)f.alternate!==null&&(v=f),f=f.sibling;v===null?a||o.tail===null?o.tail=null:o.tail.sibling=null:v.sibling=null}}function En(o){var a=o.alternate!==null&&o.alternate.child===o.child,f=0,v=0;if(a)for(var S=o.child;S!==null;)f|=S.lanes|S.childLanes,v|=S.subtreeFlags&14680064,v|=S.flags&14680064,S.return=o,S=S.sibling;else for(S=o.child;S!==null;)f|=S.lanes|S.childLanes,v|=S.subtreeFlags,v|=S.flags,S.return=o,S=S.sibling;return o.subtreeFlags|=v,o.childLanes=f,a}function bx(o,a,f){var v=a.pendingProps;switch(Yh(a),a.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return En(a),null;case 1:return Ot(a.type)&&vr(),En(a),null;case 3:return v=a.stateNode,Gs(),vt(lt),vt(Et),$h(),v.pendingContext&&(v.context=v.pendingContext,v.pendingContext=null),(o===null||o.child===null)&&(Fo(a)?Oi(a):o===null||o.memoizedState.isDehydrated&&!(a.flags&256)||(a.flags|=1024,yi!==null&&(Rf(yi),yi=null))),Yo(o,a),En(a),null;case 5:jh(a),f=Ui(Vs.current);var S=a.type;if(o!==null&&a.stateNode!=null)Ol(o,a,S,v,f),o.ref!==a.ref&&(a.flags|=512,a.flags|=2097152);else{if(!v){if(a.stateNode===null)throw Error(l(166));return En(a),null}if(o=Ui(ci.current),Fo(a)){if(!N)throw Error(l(175));o=fl(a.stateNode,a.type,a.memoizedProps,f,o,a,!Oo),a.updateQueue=o,o!==null&&Oi(a)}else{var A=ie(S,v,f,o,a);Xo(A,a,!1,!1),a.stateNode=A,ze(A,S,v,f,o)&&Oi(a)}a.ref!==null&&(a.flags|=512,a.flags|=2097152)}return En(a),null;case 6:if(o&&a.stateNode!=null)Fl(o,a,o.memoizedProps,v);else{if(typeof v!="string"&&a.stateNode===null)throw Error(l(166));if(o=Ui(Vs.current),f=Ui(ci.current),Fo(a)){if(!N)throw Error(l(176));if(o=a.stateNode,v=a.memoizedProps,(f=bh(o,v,a,!Oo))&&(S=Kn,S!==null))switch(A=(S.mode&1)!==0,S.tag){case 3:Se(S.stateNode.containerInfo,o,v,A);break;case 5:De(S.type,S.memoizedProps,S.stateNode,o,v,A)}f&&Oi(a)}else a.stateNode=Me(v,o,f,a)}return En(a),null;case 13:if(vt(Wt),v=a.memoizedState,Vt&&jn!==null&&a.mode&1&&!(a.flags&128)){for(o=jn;o;)o=Ri(o);return ks(),a.flags|=98560,a}if(v!==null&&v.dehydrated!==null){if(v=Fo(a),o===null){if(!v)throw Error(l(318));if(!N)throw Error(l(344));if(o=a.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(l(317));Ch(o,a)}else ks(),!(a.flags&128)&&(a.memoizedState=null),a.flags|=4;return En(a),null}return yi!==null&&(Rf(yi),yi=null),a.flags&128?(a.lanes=f,a):(v=v!==null,f=!1,o===null?Fo(a):f=o.memoizedState!==null,v&&!f&&(a.child.flags|=8192,a.mode&1&&(o===null||Wt.current&1?sn===0&&(sn=3):If())),a.updateQueue!==null&&(a.flags|=4),En(a),null);case 4:return Gs(),Yo(o,a),o===null&&we(a.stateNode.containerInfo),En(a),null;case 10:return kh(a.type._context),En(a),null;case 17:return Ot(a.type)&&vr(),En(a),null;case 19:if(vt(Wt),S=a.memoizedState,S===null)return En(a),null;if(v=(a.flags&128)!==0,A=S.rendering,A===null)if(v)qo(S,!1);else{if(sn!==0||o!==null&&o.flags&128)for(o=a.child;o!==null;){if(A=Cl(o),A!==null){for(a.flags|=128,qo(S,!1),o=A.updateQueue,o!==null&&(a.updateQueue=o,a.flags|=4),a.subtreeFlags=0,o=f,v=a.child;v!==null;)f=v,S=o,f.flags&=14680066,A=f.alternate,A===null?(f.childLanes=0,f.lanes=S,f.child=null,f.subtreeFlags=0,f.memoizedProps=null,f.memoizedState=null,f.updateQueue=null,f.dependencies=null,f.stateNode=null):(f.childLanes=A.childLanes,f.lanes=A.lanes,f.child=A.child,f.subtreeFlags=0,f.deletions=null,f.memoizedProps=A.memoizedProps,f.memoizedState=A.memoizedState,f.updateQueue=A.updateQueue,f.type=A.type,S=A.dependencies,f.dependencies=S===null?null:{lanes:S.lanes,firstContext:S.firstContext}),v=v.sibling;return Ke(Wt,Wt.current&1|2),a.child}o=o.sibling}S.tail!==null&&ln()>Af&&(a.flags|=128,v=!0,qo(S,!1),a.lanes=4194304)}else{if(!v)if(o=Cl(A),o!==null){if(a.flags|=128,v=!0,o=o.updateQueue,o!==null&&(a.updateQueue=o,a.flags|=4),qo(S,!0),S.tail===null&&S.tailMode==="hidden"&&!A.alternate&&!Vt)return En(a),null}else 2*ln()-S.renderingStartTime>Af&&f!==1073741824&&(a.flags|=128,v=!0,qo(S,!1),a.lanes=4194304);S.isBackwards?(A.sibling=a.child,a.child=A):(o=S.last,o!==null?o.sibling=A:a.child=A,S.last=A)}return S.tail!==null?(a=S.tail,S.rendering=a,S.tail=a.sibling,S.renderingStartTime=ln(),a.sibling=null,o=Wt.current,Ke(Wt,v?o&1|2:o&1),a):(En(a),null);case 22:case 23:return Pf(),v=a.memoizedState!==null,o!==null&&o.memoizedState!==null!==v&&(a.flags|=8192),v&&a.mode&1?$n&1073741824&&(En(a),nt&&a.subtreeFlags&6&&(a.flags|=8192)):En(a),null;case 24:return null;case 25:return null}throw Error(l(156,a.tag))}var Cx=c.ReactCurrentOwner,Qn=!1;function Dn(o,a,f,v){a.child=o===null?_m(a,null,f,v):Hs(a,o.child,f,v)}function Xm(o,a,f,v,S){f=f.render;var A=a.ref;return Fs(a,S),v=tf(o,a,f,v,A,S),f=nf(),o!==null&&!Qn?(a.updateQueue=o.updateQueue,a.flags&=-2053,o.lanes&=~S,er(o,a,S)):(Vt&&f&&Xh(a),a.flags|=1,Dn(o,a,v,S),a.child)}function Ym(o,a,f,v,S){if(o===null){var A=f.type;return typeof A=="function"&&!Lf(A)&&A.defaultProps===void 0&&f.compare===null&&f.defaultProps===void 0?(a.tag=15,a.type=A,qm(o,a,A,v,S)):(o=rc(f.type,null,v,a,a.mode,S),o.ref=a.ref,o.return=a,a.child=o)}if(A=o.child,!(o.lanes&S)){var B=A.memoizedProps;if(f=f.compare,f=f!==null?f:yl,f(B,v)&&o.ref===a.ref)return er(o,a,S)}return a.flags|=1,o=Ar(A,v),o.ref=a.ref,o.return=a,a.child=o}function qm(o,a,f,v,S){if(o!==null&&yl(o.memoizedProps,v)&&o.ref===a.ref)if(Qn=!1,(o.lanes&S)!==0)o.flags&131072&&(Qn=!0);else return a.lanes=o.lanes,er(o,a,S);return cf(o,a,f,v,S)}function Zm(o,a,f){var v=a.pendingProps,S=v.children,A=o!==null?o.memoizedState:null;if(v.mode==="hidden")if(!(a.mode&1))a.memoizedState={baseLanes:0,cachePool:null},Ke(Xs,$n),$n|=f;else if(f&1073741824)a.memoizedState={baseLanes:0,cachePool:null},v=A!==null?A.baseLanes:f,Ke(Xs,$n),$n|=v;else return o=A!==null?A.baseLanes|f:f,a.lanes=a.childLanes=1073741824,a.memoizedState={baseLanes:o,cachePool:null},a.updateQueue=null,Ke(Xs,$n),$n|=o,null;else A!==null?(v=A.baseLanes|f,a.memoizedState=null):v=f,Ke(Xs,$n),$n|=v;return Dn(o,a,S,f),a.child}function Jm(o,a){var f=a.ref;(o===null&&f!==null||o!==null&&o.ref!==f)&&(a.flags|=512,a.flags|=2097152)}function cf(o,a,f,v,S){var A=Ot(f)?rn:Et.current;return A=Jn(a,A),Fs(a,S),f=tf(o,a,f,v,A,S),v=nf(),o!==null&&!Qn?(a.updateQueue=o.updateQueue,a.flags&=-2053,o.lanes&=~S,er(o,a,S)):(Vt&&v&&Xh(a),a.flags|=1,Dn(o,a,f,S),a.child)}function Km(o,a,f,v,S){if(Ot(f)){var A=!0;_r(a)}else A=!1;if(Fs(a,S),a.stateNode===null)o!==null&&(o.alternate=null,a.alternate=null,a.flags|=2),um(a,f,v),Wh(a,f,v,S),v=!0;else if(o===null){var B=a.stateNode,k=a.memoizedProps;B.props=k;var oe=B.context,_e=f.contextType;typeof _e=="object"&&_e!==null?_e=oi(_e):(_e=Ot(f)?rn:Et.current,_e=Jn(a,_e));var Ge=f.getDerivedStateFromProps,ut=typeof Ge=="function"||typeof B.getSnapshotBeforeUpdate=="function";ut||typeof B.UNSAFE_componentWillReceiveProps!="function"&&typeof B.componentWillReceiveProps!="function"||(k!==v||oe!==_e)&&hm(a,B,v,_e),yr=!1;var $e=a.memoizedState;B.state=$e,wl(a,v,B,S),oe=a.memoizedState,k!==v||$e!==oe||lt.current||yr?(typeof Ge=="function"&&(Gh(a,f,Ge,v),oe=a.memoizedState),(k=yr||cm(a,f,k,v,$e,oe,_e))?(ut||typeof B.UNSAFE_componentWillMount!="function"&&typeof B.componentWillMount!="function"||(typeof B.componentWillMount=="function"&&B.componentWillMount(),typeof B.UNSAFE_componentWillMount=="function"&&B.UNSAFE_componentWillMount()),typeof B.componentDidMount=="function"&&(a.flags|=4194308)):(typeof B.componentDidMount=="function"&&(a.flags|=4194308),a.memoizedProps=v,a.memoizedState=oe),B.props=v,B.state=oe,B.context=_e,v=k):(typeof B.componentDidMount=="function"&&(a.flags|=4194308),v=!1)}else{B=a.stateNode,sm(o,a),k=a.memoizedProps,_e=a.type===a.elementType?k:_i(a.type,k),B.props=_e,ut=a.pendingProps,$e=B.context,oe=f.contextType,typeof oe=="object"&&oe!==null?oe=oi(oe):(oe=Ot(f)?rn:Et.current,oe=Jn(a,oe));var Ft=f.getDerivedStateFromProps;(Ge=typeof Ft=="function"||typeof B.getSnapshotBeforeUpdate=="function")||typeof B.UNSAFE_componentWillReceiveProps!="function"&&typeof B.componentWillReceiveProps!="function"||(k!==ut||$e!==oe)&&hm(a,B,v,oe),yr=!1,$e=a.memoizedState,B.state=$e,wl(a,v,B,S);var je=a.memoizedState;k!==ut||$e!==je||lt.current||yr?(typeof Ft=="function"&&(Gh(a,f,Ft,v),je=a.memoizedState),(_e=yr||cm(a,f,_e,v,$e,je,oe)||!1)?(Ge||typeof B.UNSAFE_componentWillUpdate!="function"&&typeof B.componentWillUpdate!="function"||(typeof B.componentWillUpdate=="function"&&B.componentWillUpdate(v,je,oe),typeof B.UNSAFE_componentWillUpdate=="function"&&B.UNSAFE_componentWillUpdate(v,je,oe)),typeof B.componentDidUpdate=="function"&&(a.flags|=4),typeof B.getSnapshotBeforeUpdate=="function"&&(a.flags|=1024)):(typeof B.componentDidUpdate!="function"||k===o.memoizedProps&&$e===o.memoizedState||(a.flags|=4),typeof B.getSnapshotBeforeUpdate!="function"||k===o.memoizedProps&&$e===o.memoizedState||(a.flags|=1024),a.memoizedProps=v,a.memoizedState=je),B.props=v,B.state=je,B.context=oe,v=_e):(typeof B.componentDidUpdate!="function"||k===o.memoizedProps&&$e===o.memoizedState||(a.flags|=4),typeof B.getSnapshotBeforeUpdate!="function"||k===o.memoizedProps&&$e===o.memoizedState||(a.flags|=1024),v=!1)}return uf(o,a,f,v,A,S)}function uf(o,a,f,v,S,A){Jm(o,a);var B=(a.flags&128)!==0;if(!v&&!B)return S&&In(a,f,!1),er(o,a,A);v=a.stateNode,Cx.current=a;var k=B&&typeof f.getDerivedStateFromError!="function"?null:v.render();return a.flags|=1,o!==null&&B?(a.child=Hs(a,o.child,null,A),a.child=Hs(a,null,k,A)):Dn(o,a,k,A),a.memoizedState=v.state,S&&In(a,f,!0),a.child}function jm(o){var a=o.stateNode;a.pendingContext?Ht(o,a.pendingContext,a.pendingContext!==a.context):a.context&&Ht(o,a.context,!1),Kh(o,a.containerInfo)}function Qm(o,a,f,v,S){return ks(),Jh(S),a.flags|=256,Dn(o,a,f,v),a.child}var Bl={dehydrated:null,treeContext:null,retryLane:0};function zl(o){return{baseLanes:o,cachePool:null}}function $m(o,a,f){var v=a.pendingProps,S=Wt.current,A=!1,B=(a.flags&128)!==0,k;if((k=B)||(k=o!==null&&o.memoizedState===null?!1:(S&2)!==0),k?(A=!0,a.flags&=-129):(o===null||o.memoizedState!==null)&&(S|=1),Ke(Wt,S&1),o===null)return Zh(a),o=a.memoizedState,o!==null&&(o=o.dehydrated,o!==null)?(a.mode&1?Us(o)?a.lanes=8:a.lanes=1073741824:a.lanes=1,null):(S=v.children,o=v.fallback,A?(v=a.mode,A=a.child,S={mode:"hidden",children:S},!(v&1)&&A!==null?(A.childLanes=0,A.pendingProps=S):A=sc(S,v,0,null),o=jr(o,v,f,null),A.return=a,o.return=a,A.sibling=o,a.child=A,a.child.memoizedState=zl(f),a.memoizedState=Bl,o):hf(a,S));if(S=o.memoizedState,S!==null){if(k=S.dehydrated,k!==null){if(B)return a.flags&256?(a.flags&=-257,kl(o,a,f,Error(l(422)))):a.memoizedState!==null?(a.child=o.child,a.flags|=128,null):(A=v.fallback,S=a.mode,v=sc({mode:"visible",children:v.children},S,0,null),A=jr(A,S,f,null),A.flags|=2,v.return=a,A.return=a,v.sibling=A,a.child=v,a.mode&1&&Hs(a,o.child,null,f),a.child.memoizedState=zl(f),a.memoizedState=Bl,A);if(!(a.mode&1))a=kl(o,a,f,null);else if(Us(k))a=kl(o,a,f,Error(l(419)));else if(v=(f&o.childLanes)!==0,Qn||v){if(v=$t,v!==null){switch(f&-f){case 4:A=2;break;case 16:A=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:A=32;break;case 536870912:A=268435456;break;default:A=0}v=A&(v.suspendedLanes|f)?0:A,v!==0&&v!==S.retryLane&&(S.retryLane=v,hi(o,v,-1))}If(),a=kl(o,a,f,Error(l(421)))}else Ds(k)?(a.flags|=128,a.child=o.child,a=Hx.bind(null,o),cl(k,a),a=null):(f=S.treeContext,N&&(jn=hl(k),Kn=a,Vt=!0,yi=null,Oo=!1,f!==null&&(ai[li++]=ji,ai[li++]=Qi,ai[li++]=Gr,ji=f.id,Qi=f.overflow,Gr=a)),a=hf(a,a.pendingProps.children),a.flags|=4096);return a}return A?(v=tg(o,a,v.children,v.fallback,f),A=a.child,S=o.child.memoizedState,A.memoizedState=S===null?zl(f):{baseLanes:S.baseLanes|f,cachePool:null},A.childLanes=o.childLanes&~f,a.memoizedState=Bl,v):(f=eg(o,a,v.children,f),a.memoizedState=null,f)}return A?(v=tg(o,a,v.children,v.fallback,f),A=a.child,S=o.child.memoizedState,A.memoizedState=S===null?zl(f):{baseLanes:S.baseLanes|f,cachePool:null},A.childLanes=o.childLanes&~f,a.memoizedState=Bl,v):(f=eg(o,a,v.children,f),a.memoizedState=null,f)}function hf(o,a){return a=sc({mode:"visible",children:a},o.mode,0,null),a.return=o,o.child=a}function eg(o,a,f,v){var S=o.child;return o=S.sibling,f=Ar(S,{mode:"visible",children:f}),!(a.mode&1)&&(f.lanes=v),f.return=a,f.sibling=null,o!==null&&(v=a.deletions,v===null?(a.deletions=[o],a.flags|=16):v.push(o)),a.child=f}function tg(o,a,f,v,S){var A=a.mode;o=o.child;var B=o.sibling,k={mode:"hidden",children:f};return!(A&1)&&a.child!==o?(f=a.child,f.childLanes=0,f.pendingProps=k,a.deletions=null):(f=Ar(o,k),f.subtreeFlags=o.subtreeFlags&14680064),B!==null?v=Ar(B,v):(v=jr(v,A,S,null),v.flags|=2),v.return=a,f.return=a,f.sibling=v,a.child=f,v}function kl(o,a,f,v){return v!==null&&Jh(v),Hs(a,o.child,null,f),o=hf(a,a.pendingProps.children),o.flags|=2,a.memoizedState=null,o}function ng(o,a,f){o.lanes|=a;var v=o.alternate;v!==null&&(v.lanes|=a),Hh(o.return,a,f)}function ff(o,a,f,v,S){var A=o.memoizedState;A===null?o.memoizedState={isBackwards:a,rendering:null,renderingStartTime:0,last:v,tail:f,tailMode:S}:(A.isBackwards=a,A.rendering=null,A.renderingStartTime=0,A.last=v,A.tail=f,A.tailMode=S)}function ig(o,a,f){var v=a.pendingProps,S=v.revealOrder,A=v.tail;if(Dn(o,a,v.children,f),v=Wt.current,v&2)v=v&1|2,a.flags|=128;else{if(o!==null&&o.flags&128)e:for(o=a.child;o!==null;){if(o.tag===13)o.memoizedState!==null&&ng(o,f,a);else if(o.tag===19)ng(o,f,a);else if(o.child!==null){o.child.return=o,o=o.child;continue}if(o===a)break e;for(;o.sibling===null;){if(o.return===null||o.return===a)break e;o=o.return}o.sibling.return=o.return,o=o.sibling}v&=1}if(Ke(Wt,v),!(a.mode&1))a.memoizedState=null;else switch(S){case"forwards":for(f=a.child,S=null;f!==null;)o=f.alternate,o!==null&&Cl(o)===null&&(S=f),f=f.sibling;f=S,f===null?(S=a.child,a.child=null):(S=f.sibling,f.sibling=null),ff(a,!1,S,f,A);break;case"backwards":for(f=null,S=a.child,a.child=null;S!==null;){if(o=S.alternate,o!==null&&Cl(o)===null){a.child=S;break}o=S.sibling,S.sibling=f,f=S,S=o}ff(a,!0,f,null,A);break;case"together":ff(a,!1,null,null,void 0);break;default:a.memoizedState=null}return a.child}function er(o,a,f){if(o!==null&&(a.dependencies=o.dependencies),Ys|=a.lanes,!(f&a.childLanes))return null;if(o!==null&&a.child!==o.child)throw Error(l(153));if(a.child!==null){for(o=a.child,f=Ar(o,o.pendingProps),a.child=f,f.return=a;o.sibling!==null;)o=o.sibling,f=f.sibling=Ar(o,o.pendingProps),f.return=a;f.sibling=null}return a.child}function Rx(o,a,f){switch(a.tag){case 3:jm(a),ks();break;case 5:ym(a);break;case 1:Ot(a.type)&&_r(a);break;case 4:Kh(a,a.stateNode.containerInfo);break;case 10:rm(a,a.type._context,a.memoizedProps.value);break;case 13:var v=a.memoizedState;if(v!==null)return v.dehydrated!==null?(Ke(Wt,Wt.current&1),a.flags|=128,null):f&a.child.childLanes?$m(o,a,f):(Ke(Wt,Wt.current&1),o=er(o,a,f),o!==null?o.sibling:null);Ke(Wt,Wt.current&1);break;case 19:if(v=(f&a.childLanes)!==0,o.flags&128){if(v)return ig(o,a,f);a.flags|=128}var S=a.memoizedState;if(S!==null&&(S.rendering=null,S.tail=null,S.lastEffect=null),Ke(Wt,Wt.current),v)break;return null;case 22:case 23:return a.lanes=0,Zm(o,a,f)}return er(o,a,f)}function Px(o,a){switch(Yh(a),a.tag){case 1:return Ot(a.type)&&vr(),o=a.flags,o&65536?(a.flags=o&-65537|128,a):null;case 3:return Gs(),vt(lt),vt(Et),$h(),o=a.flags,o&65536&&!(o&128)?(a.flags=o&-65537|128,a):null;case 5:return jh(a),null;case 13:if(vt(Wt),o=a.memoizedState,o!==null&&o.dehydrated!==null){if(a.alternate===null)throw Error(l(340));ks()}return o=a.flags,o&65536?(a.flags=o&-65537|128,a):null;case 19:return vt(Wt),null;case 4:return Gs(),null;case 10:return kh(a.type._context),null;case 22:case 23:return Pf(),null;case 24:return null;default:return null}}var Hl=!1,Yr=!1,Ix=typeof WeakSet=="function"?WeakSet:Set,Re=null;function Vl(o,a){var f=o.ref;if(f!==null)if(typeof f=="function")try{f(null)}catch(v){Vn(o,a,v)}else f.current=null}function df(o,a,f){try{f()}catch(v){Vn(o,a,v)}}var rg=!1;function Lx(o,a){for(J(o.containerInfo),Re=a;Re!==null;)if(o=Re,a=o.child,(o.subtreeFlags&1028)!==0&&a!==null)a.return=o,Re=a;else for(;Re!==null;){o=Re;try{var f=o.alternate;if(o.flags&1024)switch(o.tag){case 0:case 11:case 15:break;case 1:if(f!==null){var v=f.memoizedProps,S=f.memoizedState,A=o.stateNode,B=A.getSnapshotBeforeUpdate(o.elementType===o.type?v:_i(o.type,v),S);A.__reactInternalSnapshotBeforeUpdate=B}break;case 3:nt&&Le(o.stateNode.containerInfo);break;case 5:case 6:case 4:case 17:break;default:throw Error(l(163))}}catch(k){Vn(o,o.return,k)}if(a=o.sibling,a!==null){a.return=o.return,Re=a;break}Re=o.return}return f=rg,rg=!1,f}function qr(o,a,f){var v=a.updateQueue;if(v=v!==null?v.lastEffect:null,v!==null){var S=v=v.next;do{if((S.tag&o)===o){var A=S.destroy;S.destroy=void 0,A!==void 0&&df(a,f,A)}S=S.next}while(S!==v)}}function Zo(o,a){if(a=a.updateQueue,a=a!==null?a.lastEffect:null,a!==null){var f=a=a.next;do{if((f.tag&o)===o){var v=f.create;f.destroy=v()}f=f.next}while(f!==a)}}function pf(o){var a=o.ref;if(a!==null){var f=o.stateNode;switch(o.tag){case 5:o=K(f);break;default:o=f}typeof a=="function"?a(o):a.current=o}}function sg(o,a,f){if(Pi&&typeof Pi.onCommitFiberUnmount=="function")try{Pi.onCommitFiberUnmount(vl,a)}catch{}switch(a.tag){case 0:case 11:case 14:case 15:if(o=a.updateQueue,o!==null&&(o=o.lastEffect,o!==null)){var v=o=o.next;do{var S=v,A=S.destroy;S=S.tag,A!==void 0&&(S&2||S&4)&&df(a,f,A),v=v.next}while(v!==o)}break;case 1:if(Vl(a,f),o=a.stateNode,typeof o.componentWillUnmount=="function")try{o.props=a.memoizedProps,o.state=a.memoizedState,o.componentWillUnmount()}catch(B){Vn(a,f,B)}break;case 5:Vl(a,f);break;case 4:nt?hg(o,a,f):he&&he&&(a=a.stateNode.containerInfo,f=Mt(a),wt(a,f))}}function og(o,a,f){for(var v=a;;)if(sg(o,v,f),v.child===null||nt&&v.tag===4){if(v===a)break;for(;v.sibling===null;){if(v.return===null||v.return===a)return;v=v.return}v.sibling.return=v.return,v=v.sibling}else v.child.return=v,v=v.child}function ag(o){var a=o.alternate;a!==null&&(o.alternate=null,ag(a)),o.child=null,o.deletions=null,o.sibling=null,o.tag===5&&(a=o.stateNode,a!==null&&Te(a)),o.stateNode=null,o.return=null,o.dependencies=null,o.memoizedProps=null,o.memoizedState=null,o.pendingProps=null,o.stateNode=null,o.updateQueue=null}function lg(o){return o.tag===5||o.tag===3||o.tag===4}function cg(o){e:for(;;){for(;o.sibling===null;){if(o.return===null||lg(o.return))return null;o=o.return}for(o.sibling.return=o.return,o=o.sibling;o.tag!==5&&o.tag!==6&&o.tag!==18;){if(o.flags&2||o.child===null||o.tag===4)continue e;o.child.return=o,o=o.child}if(!(o.flags&2))return o.stateNode}}function ug(o){if(nt){e:{for(var a=o.return;a!==null;){if(lg(a))break e;a=a.return}throw Error(l(160))}var f=a;switch(f.tag){case 5:a=f.stateNode,f.flags&32&&(Ut(a),f.flags&=-33),f=cg(o),gf(o,f,a);break;case 3:case 4:a=f.stateNode.containerInfo,f=cg(o),mf(o,f,a);break;default:throw Error(l(161))}}}function mf(o,a,f){var v=o.tag;if(v===5||v===6)o=o.stateNode,a?ke(f,o,a):xt(f,o);else if(v!==4&&(o=o.child,o!==null))for(mf(o,a,f),o=o.sibling;o!==null;)mf(o,a,f),o=o.sibling}function gf(o,a,f){var v=o.tag;if(v===5||v===6)o=o.stateNode,a?at(f,o,a):Fe(f,o);else if(v!==4&&(o=o.child,o!==null))for(gf(o,a,f),o=o.sibling;o!==null;)gf(o,a,f),o=o.sibling}function hg(o,a,f){for(var v=a,S=!1,A,B;;){if(!S){S=v.return;e:for(;;){if(S===null)throw Error(l(160));switch(A=S.stateNode,S.tag){case 5:B=!1;break e;case 3:A=A.containerInfo,B=!0;break e;case 4:A=A.containerInfo,B=!0;break e}S=S.return}S=!0}if(v.tag===5||v.tag===6)og(o,v,f),B?ct(A,v.stateNode):St(A,v.stateNode);else if(v.tag===18)B?te(A,v.stateNode):ee(A,v.stateNode);else if(v.tag===4){if(v.child!==null){A=v.stateNode.containerInfo,B=!0,v.child.return=v,v=v.child;continue}}else if(sg(o,v,f),v.child!==null){v.child.return=v,v=v.child;continue}if(v===a)break;for(;v.sibling===null;){if(v.return===null||v.return===a)return;v=v.return,v.tag===4&&(S=!1)}v.sibling.return=v.return,v=v.sibling}}function vf(o,a){if(nt){switch(a.tag){case 0:case 11:case 14:case 15:qr(3,a,a.return),Zo(3,a),qr(5,a,a.return);return;case 1:return;case 5:var f=a.stateNode;if(f!=null){var v=a.memoizedProps;o=o!==null?o.memoizedProps:v;var S=a.type,A=a.updateQueue;a.updateQueue=null,A!==null&&ot(f,A,S,o,v,a)}return;case 6:if(a.stateNode===null)throw Error(l(162));f=a.memoizedProps,ve(a.stateNode,o!==null?o.memoizedProps:f,f);return;case 3:N&&o!==null&&o.memoizedState.isDehydrated&&I(a.stateNode.containerInfo);return;case 12:return;case 13:Gl(a);return;case 19:Gl(a);return;case 17:return}throw Error(l(163))}switch(a.tag){case 0:case 11:case 14:case 15:qr(3,a,a.return),Zo(3,a),qr(5,a,a.return);return;case 12:return;case 13:Gl(a);return;case 19:Gl(a);return;case 3:N&&o!==null&&o.memoizedState.isDehydrated&&I(a.stateNode.containerInfo);break;case 22:case 23:return}e:if(he){switch(a.tag){case 1:case 5:case 6:break e;case 3:case 4:a=a.stateNode,wt(a.containerInfo,a.pendingChildren);break e}throw Error(l(163))}}function Gl(o){var a=o.updateQueue;if(a!==null){o.updateQueue=null;var f=o.stateNode;f===null&&(f=o.stateNode=new Ix),a.forEach(function(v){var S=Vx.bind(null,o,v);f.has(v)||(f.add(v),v.then(S,S))})}}function Dx(o,a){for(Re=a;Re!==null;){a=Re;var f=a.deletions;if(f!==null)for(var v=0;v<f.length;v++){var S=f[v];try{var A=o;nt?hg(A,S,a):og(A,S,a);var B=S.alternate;B!==null&&(B.return=null),S.return=null}catch(Ze){Vn(S,a,Ze)}}if(f=a.child,a.subtreeFlags&12854&&f!==null)f.return=a,Re=f;else for(;Re!==null;){a=Re;try{var k=a.flags;if(k&32&&nt&&Ut(a.stateNode),k&512){var oe=a.alternate;if(oe!==null){var _e=oe.ref;_e!==null&&(typeof _e=="function"?_e(null):_e.current=null)}}if(k&8192)switch(a.tag){case 13:if(a.memoizedState!==null){var Ge=a.alternate;(Ge===null||Ge.memoizedState===null)&&(Ef=ln())}break;case 22:var ut=a.memoizedState!==null,$e=a.alternate,Ft=$e!==null&&$e.memoizedState!==null;if(f=a,nt){e:if(v=f,S=ut,A=null,nt)for(var je=v;;){if(je.tag===5){if(A===null){A=je;var An=je.stateNode;S?H(An):se(je.stateNode,je.memoizedProps)}}else if(je.tag===6){if(A===null){var di=je.stateNode;S?Ne(di):pe(di,je.memoizedProps)}}else if((je.tag!==22&&je.tag!==23||je.memoizedState===null||je===v)&&je.child!==null){je.child.return=je,je=je.child;continue}if(je===v)break;for(;je.sibling===null;){if(je.return===null||je.return===v)break e;A===je&&(A=null),je=je.return}A===je&&(A=null),je.sibling.return=je.return,je=je.sibling}}if(ut&&!Ft&&f.mode&1){Re=f;for(var $=f.child;$!==null;){for(f=Re=$;Re!==null;){v=Re;var W=v.child;switch(v.tag){case 0:case 11:case 14:case 15:qr(4,v,v.return);break;case 1:Vl(v,v.return);var re=v.stateNode;if(typeof re.componentWillUnmount=="function"){var Pe=v.return;try{re.props=v.memoizedProps,re.state=v.memoizedState,re.componentWillUnmount()}catch(Ze){Vn(v,Pe,Ze)}}break;case 5:Vl(v,v.return);break;case 22:if(v.memoizedState!==null){pg(f);continue}}W!==null?(W.return=v,Re=W):pg(f)}$=$.sibling}}}switch(k&4102){case 2:ug(a),a.flags&=-3;break;case 6:ug(a),a.flags&=-3,vf(a.alternate,a);break;case 4096:a.flags&=-4097;break;case 4100:a.flags&=-4097,vf(a.alternate,a);break;case 4:vf(a.alternate,a)}}catch(Ze){Vn(a,a.return,Ze)}if(f=a.sibling,f!==null){f.return=a.return,Re=f;break}Re=a.return}}}function Ux(o,a,f){Re=o,fg(o)}function fg(o,a,f){for(var v=(o.mode&1)!==0;Re!==null;){var S=Re,A=S.child;if(S.tag===22&&v){var B=S.memoizedState!==null||Hl;if(!B){var k=S.alternate,oe=k!==null&&k.memoizedState!==null||Yr;k=Hl;var _e=Yr;if(Hl=B,(Yr=oe)&&!_e)for(Re=S;Re!==null;)B=Re,oe=B.child,B.tag===22&&B.memoizedState!==null?mg(S):oe!==null?(oe.return=B,Re=oe):mg(S);for(;A!==null;)Re=A,fg(A),A=A.sibling;Re=S,Hl=k,Yr=_e}dg(o)}else S.subtreeFlags&8772&&A!==null?(A.return=S,Re=A):dg(o)}}function dg(o){for(;Re!==null;){var a=Re;if(a.flags&8772){var f=a.alternate;try{if(a.flags&8772)switch(a.tag){case 0:case 11:case 15:Yr||Zo(5,a);break;case 1:var v=a.stateNode;if(a.flags&4&&!Yr)if(f===null)v.componentDidMount();else{var S=a.elementType===a.type?f.memoizedProps:_i(a.type,f.memoizedProps);v.componentDidUpdate(S,f.memoizedState,v.__reactInternalSnapshotBeforeUpdate)}var A=a.updateQueue;A!==null&&am(a,A,v);break;case 3:var B=a.updateQueue;if(B!==null){if(f=null,a.child!==null)switch(a.child.tag){case 5:f=K(a.child.stateNode);break;case 1:f=a.child.stateNode}am(a,B,f)}break;case 5:var k=a.stateNode;f===null&&a.flags&4&&Be(k,a.type,a.memoizedProps,a);break;case 6:break;case 4:break;case 12:break;case 13:if(N&&a.memoizedState===null){var oe=a.alternate;if(oe!==null){var _e=oe.memoizedState;if(_e!==null){var Ge=_e.dehydrated;Ge!==null&&V(Ge)}}}break;case 19:case 17:case 21:case 22:case 23:break;default:throw Error(l(163))}Yr||a.flags&512&&pf(a)}catch(ut){Vn(a,a.return,ut)}}if(a===o){Re=null;break}if(f=a.sibling,f!==null){f.return=a.return,Re=f;break}Re=a.return}}function pg(o){for(;Re!==null;){var a=Re;if(a===o){Re=null;break}var f=a.sibling;if(f!==null){f.return=a.return,Re=f;break}Re=a.return}}function mg(o){for(;Re!==null;){var a=Re;try{switch(a.tag){case 0:case 11:case 15:var f=a.return;try{Zo(4,a)}catch(oe){Vn(a,f,oe)}break;case 1:var v=a.stateNode;if(typeof v.componentDidMount=="function"){var S=a.return;try{v.componentDidMount()}catch(oe){Vn(a,S,oe)}}var A=a.return;try{pf(a)}catch(oe){Vn(a,A,oe)}break;case 5:var B=a.return;try{pf(a)}catch(oe){Vn(a,B,oe)}}}catch(oe){Vn(a,a.return,oe)}if(a===o){Re=null;break}var k=a.sibling;if(k!==null){k.return=a.return,Re=k;break}Re=a.return}}var Wl=0,Xl=1,Yl=2,ql=3,Zl=4;if(typeof Symbol=="function"&&Symbol.for){var Jo=Symbol.for;Wl=Jo("selector.component"),Xl=Jo("selector.has_pseudo_class"),Yl=Jo("selector.role"),ql=Jo("selector.test_id"),Zl=Jo("selector.text")}function _f(o){var a=Ae(o);if(a!=null){if(typeof a.memoizedProps["data-testname"]!="string")throw Error(l(364));return a}if(o=R(o),o===null)throw Error(l(362));return o.stateNode.current}function yf(o,a){switch(a.$$typeof){case Wl:if(o.type===a.value)return!0;break;case Xl:e:{a=a.value,o=[o,0];for(var f=0;f<o.length;){var v=o[f++],S=o[f++],A=a[S];if(v.tag!==5||!ue(v)){for(;A!=null&&yf(v,A);)S++,A=a[S];if(S===a.length){a=!0;break e}else for(v=v.child;v!==null;)o.push(v,S),v=v.sibling}}a=!1}return a;case Yl:if(o.tag===5&&ce(o.stateNode,a.value))return!0;break;case Zl:if((o.tag===5||o.tag===6)&&(o=le(o),o!==null&&0<=o.indexOf(a.value)))return!0;break;case ql:if(o.tag===5&&(o=o.memoizedProps["data-testname"],typeof o=="string"&&o.toLowerCase()===a.value.toLowerCase()))return!0;break;default:throw Error(l(365))}return!1}function xf(o){switch(o.$$typeof){case Wl:return"<"+(L(o.value)||"Unknown")+">";case Xl:return":has("+(xf(o)||"")+")";case Yl:return'[role="'+o.value+'"]';case Zl:return'"'+o.value+'"';case ql:return'[data-testname="'+o.value+'"]';default:throw Error(l(365))}}function gg(o,a){var f=[];o=[o,0];for(var v=0;v<o.length;){var S=o[v++],A=o[v++],B=a[A];if(S.tag!==5||!ue(S)){for(;B!=null&&yf(S,B);)A++,B=a[A];if(A===a.length)f.push(S);else for(S=S.child;S!==null;)o.push(S,A),S=S.sibling}}return f}function Sf(o,a){if(!U)throw Error(l(363));o=_f(o),o=gg(o,a),a=[],o=Array.from(o);for(var f=0;f<o.length;){var v=o[f++];if(v.tag===5)ue(v)||a.push(v.stateNode);else for(v=v.child;v!==null;)o.push(v),v=v.sibling}return a}var Nx=Math.ceil,Jl=c.ReactCurrentDispatcher,Mf=c.ReactCurrentOwner,Kt=c.ReactCurrentBatchConfig,_t=0,$t=null,en=null,vn=0,$n=0,Xs=Dt(0),sn=0,Ko=null,Ys=0,Kl=0,wf=0,jo=null,kn=null,Ef=0,Af=1/0;function qs(){Af=ln()+500}var jl=!1,Tf=null,Sr=null,Ql=!1,Mr=null,$l=0,Qo=0,bf=null,ec=-1,tc=0;function Un(){return _t&6?ln():ec!==-1?ec:ec=ln()}function wr(o){return o.mode&1?_t&2&&vn!==0?vn&-vn:vx.transition!==null?(tc===0&&(o=pl,pl<<=1,!(pl&4194240)&&(pl=64),tc=o),tc):(o=Rt,o!==0?o:ge()):1}function hi(o,a,f){if(50<Qo)throw Qo=0,bf=null,Error(l(185));var v=nc(o,a);return v===null?null:(No(v,a,f),(!(_t&2)||v!==$t)&&(v===$t&&(!(_t&2)&&(Kl|=a),sn===4&&Er(v,vn)),Hn(v,f),a===1&&_t===0&&!(o.mode&1)&&(qs(),_l&&Li())),v)}function nc(o,a){o.lanes|=a;var f=o.alternate;for(f!==null&&(f.lanes|=a),f=o,o=o.return;o!==null;)o.childLanes|=a,f=o.alternate,f!==null&&(f.childLanes|=a),f=o,o=o.return;return f.tag===3?f.stateNode:null}function Hn(o,a){var f=o.callbackNode;lx(o,a);var v=gl(o,o===$t?vn:0);if(v===0)f!==null&&nm(f),o.callbackNode=null,o.callbackPriority=0;else if(a=v&-v,o.callbackPriority!==a){if(f!=null&&nm(f),a===1)o.tag===0?gx(_g.bind(null,o)):im(_g.bind(null,o)),Je?Ue(function(){_t===0&&Li()}):Uh(Nh,Li),f=null;else{switch(tm(v)){case 1:f=Nh;break;case 4:f=fx;break;case 16:f=Oh;break;case 536870912:f=dx;break;default:f=Oh}f=bg(f,vg.bind(null,o))}o.callbackPriority=a,o.callbackNode=f}}function vg(o,a){if(ec=-1,tc=0,_t&6)throw Error(l(327));var f=o.callbackNode;if(Kr()&&o.callbackNode!==f)return null;var v=gl(o,o===$t?vn:0);if(v===0)return null;if(v&30||v&o.expiredLanes||a)a=ic(o,v);else{a=v;var S=_t;_t|=2;var A=Sg();($t!==o||vn!==a)&&(qs(),Zr(o,a));do try{Bx();break}catch(k){xg(o,k)}while(!0);zh(),Jl.current=A,_t=S,en!==null?a=0:($t=null,vn=0,a=sn)}if(a!==0){if(a===2&&(S=Ih(o),S!==0&&(v=S,a=Cf(o,S))),a===1)throw f=Ko,Zr(o,0),Er(o,v),Hn(o,ln()),f;if(a===6)Er(o,v);else{if(S=o.current.alternate,!(v&30)&&!Ox(S)&&(a=ic(o,v),a===2&&(A=Ih(o),A!==0&&(v=A,a=Cf(o,A))),a===1))throw f=Ko,Zr(o,0),Er(o,v),Hn(o,ln()),f;switch(o.finishedWork=S,o.finishedLanes=v,a){case 0:case 1:throw Error(l(345));case 2:Jr(o,kn);break;case 3:if(Er(o,v),(v&130023424)===v&&(a=Ef+500-ln(),10<a)){if(gl(o,0)!==0)break;if(S=o.suspendedLanes,(S&v)!==v){Un(),o.pingedLanes|=o.suspendedLanes&S;break}o.timeoutHandle=ye(Jr.bind(null,o,kn),a);break}Jr(o,kn);break;case 4:if(Er(o,v),(v&4194240)===v)break;for(a=o.eventTimes,S=-1;0<v;){var B=31-Ln(v);A=1<<B,B=a[B],B>S&&(S=B),v&=~A}if(v=S,v=ln()-v,v=(120>v?120:480>v?480:1080>v?1080:1920>v?1920:3e3>v?3e3:4320>v?4320:1960*Nx(v/1960))-v,10<v){o.timeoutHandle=ye(Jr.bind(null,o,kn),v);break}Jr(o,kn);break;case 5:Jr(o,kn);break;default:throw Error(l(329))}}}return Hn(o,ln()),o.callbackNode===f?vg.bind(null,o):null}function Cf(o,a){var f=jo;return o.current.memoizedState.isDehydrated&&(Zr(o,a).flags|=256),o=ic(o,a),o!==2&&(a=kn,kn=f,a!==null&&Rf(a)),o}function Rf(o){kn===null?kn=o:kn.push.apply(kn,o)}function Ox(o){for(var a=o;;){if(a.flags&16384){var f=a.updateQueue;if(f!==null&&(f=f.stores,f!==null))for(var v=0;v<f.length;v++){var S=f[v],A=S.getSnapshot;S=S.value;try{if(!Ii(A(),S))return!1}catch{return!1}}}if(f=a.child,a.subtreeFlags&16384&&f!==null)f.return=a,a=f;else{if(a===o)break;for(;a.sibling===null;){if(a.return===null||a.return===o)return!0;a=a.return}a.sibling.return=a.return,a=a.sibling}}return!0}function Er(o,a){for(a&=~wf,a&=~Kl,o.suspendedLanes|=a,o.pingedLanes&=~a,o=o.expirationTimes;0<a;){var f=31-Ln(a),v=1<<f;o[f]=-1,a&=~v}}function _g(o){if(_t&6)throw Error(l(327));Kr();var a=gl(o,0);if(!(a&1))return Hn(o,ln()),null;var f=ic(o,a);if(o.tag!==0&&f===2){var v=Ih(o);v!==0&&(a=v,f=Cf(o,v))}if(f===1)throw f=Ko,Zr(o,0),Er(o,a),Hn(o,ln()),f;if(f===6)throw Error(l(345));return o.finishedWork=o.current.alternate,o.finishedLanes=a,Jr(o,kn),Hn(o,ln()),null}function yg(o){Mr!==null&&Mr.tag===0&&!(_t&6)&&Kr();var a=_t;_t|=1;var f=Kt.transition,v=Rt;try{if(Kt.transition=null,Rt=1,o)return o()}finally{Rt=v,Kt.transition=f,_t=a,!(_t&6)&&Li()}}function Pf(){$n=Xs.current,vt(Xs)}function Zr(o,a){o.finishedWork=null,o.finishedLanes=0;var f=o.timeoutHandle;if(f!==Qe&&(o.timeoutHandle=Qe,rt(f)),en!==null)for(f=en.return;f!==null;){var v=f;switch(Yh(v),v.tag){case 1:v=v.type.childContextTypes,v!=null&&vr();break;case 3:Gs(),vt(lt),vt(Et),$h();break;case 5:jh(v);break;case 4:Gs();break;case 13:vt(Wt);break;case 19:vt(Wt);break;case 10:kh(v.type._context);break;case 22:case 23:Pf()}f=f.return}if($t=o,en=o=Ar(o.current,null),vn=$n=a,sn=0,Ko=null,wf=Kl=Ys=0,kn=jo=null,Di!==null){for(a=0;a<Di.length;a++)if(f=Di[a],v=f.interleaved,v!==null){f.interleaved=null;var S=v.next,A=f.pending;if(A!==null){var B=A.next;A.next=S,v.next=B}f.pending=v}Di=null}return o}function xg(o,a){do{var f=en;try{if(zh(),Rl.current=Nl,Pl){for(var v=Yt.memoizedState;v!==null;){var S=v.queue;S!==null&&(S.pending=null),v=v.next}Pl=!1}if(Ws=0,cn=Mn=Yt=null,Ho=!1,Vo=0,Mf.current=null,f===null||f.return===null){sn=1,Ko=a,en=null;break}e:{var A=o,B=f.return,k=f,oe=a;if(a=vn,k.flags|=32768,oe!==null&&typeof oe=="object"&&typeof oe.then=="function"){var _e=oe,Ge=k,ut=Ge.tag;if(!(Ge.mode&1)&&(ut===0||ut===11||ut===15)){var $e=Ge.alternate;$e?(Ge.updateQueue=$e.updateQueue,Ge.memoizedState=$e.memoizedState,Ge.lanes=$e.lanes):(Ge.updateQueue=null,Ge.memoizedState=null)}var Ft=Hm(B);if(Ft!==null){Ft.flags&=-257,Vm(Ft,B,k,A,a),Ft.mode&1&&km(A,_e,a),a=Ft,oe=_e;var je=a.updateQueue;if(je===null){var An=new Set;An.add(oe),a.updateQueue=An}else je.add(oe);break e}else{if(!(a&1)){km(A,_e,a),If();break e}oe=Error(l(426))}}else if(Vt&&k.mode&1){var di=Hm(B);if(di!==null){!(di.flags&65536)&&(di.flags|=256),Vm(di,B,k,A,a),Jh(oe);break e}}A=oe,sn!==4&&(sn=2),jo===null?jo=[A]:jo.push(A),oe=af(oe,k),k=B;do{switch(k.tag){case 3:k.flags|=65536,a&=-a,k.lanes|=a;var $=Bm(k,oe,a);om(k,$);break e;case 1:A=oe;var W=k.type,re=k.stateNode;if(!(k.flags&128)&&(typeof W.getDerivedStateFromError=="function"||re!==null&&typeof re.componentDidCatch=="function"&&(Sr===null||!Sr.has(re)))){k.flags|=65536,a&=-a,k.lanes|=a;var Pe=zm(k,A,a);om(k,Pe);break e}}k=k.return}while(k!==null)}wg(f)}catch(Ze){a=Ze,en===f&&f!==null&&(en=f=f.return);continue}break}while(!0)}function Sg(){var o=Jl.current;return Jl.current=Nl,o===null?Nl:o}function If(){(sn===0||sn===3||sn===2)&&(sn=4),$t===null||!(Ys&268435455)&&!(Kl&268435455)||Er($t,vn)}function ic(o,a){var f=_t;_t|=2;var v=Sg();$t===o&&vn===a||Zr(o,a);do try{Fx();break}catch(S){xg(o,S)}while(!0);if(zh(),_t=f,Jl.current=v,en!==null)throw Error(l(261));return $t=null,vn=0,sn}function Fx(){for(;en!==null;)Mg(en)}function Bx(){for(;en!==null&&!ux();)Mg(en)}function Mg(o){var a=Tg(o.alternate,o,$n);o.memoizedProps=o.pendingProps,a===null?wg(o):en=a,Mf.current=null}function wg(o){var a=o;do{var f=a.alternate;if(o=a.return,a.flags&32768){if(f=Px(f,a),f!==null){f.flags&=32767,en=f;return}if(o!==null)o.flags|=32768,o.subtreeFlags=0,o.deletions=null;else{sn=6,en=null;return}}else if(f=bx(f,a,$n),f!==null){en=f;return}if(a=a.sibling,a!==null){en=a;return}en=a=o}while(a!==null);sn===0&&(sn=5)}function Jr(o,a){var f=Rt,v=Kt.transition;try{Kt.transition=null,Rt=1,zx(o,a,f)}finally{Kt.transition=v,Rt=f}return null}function zx(o,a,f){do Kr();while(Mr!==null);if(_t&6)throw Error(l(327));var v=o.finishedWork,S=o.finishedLanes;if(v===null)return null;if(o.finishedWork=null,o.finishedLanes=0,v===o.current)throw Error(l(177));o.callbackNode=null,o.callbackPriority=0;var A=v.lanes|v.childLanes;if(cx(o,A),o===$t&&(en=$t=null,vn=0),!(v.subtreeFlags&2064)&&!(v.flags&2064)||Ql||(Ql=!0,bg(Oh,function(){return Kr(),null})),A=(v.flags&15990)!==0,v.subtreeFlags&15990||A){A=Kt.transition,Kt.transition=null;var B=Rt;Rt=1;var k=_t;_t|=4,Mf.current=null,Lx(o,v),Dx(o,v),Z(o.containerInfo),o.current=v,Ux(v),hx(),_t=k,Rt=B,Kt.transition=A}else o.current=v;if(Ql&&(Ql=!1,Mr=o,$l=S),A=o.pendingLanes,A===0&&(Sr=null),px(v.stateNode),Hn(o,ln()),a!==null)for(f=o.onRecoverableError,v=0;v<a.length;v++)f(a[v]);if(jl)throw jl=!1,o=Tf,Tf=null,o;return $l&1&&o.tag!==0&&Kr(),A=o.pendingLanes,A&1?o===bf?Qo++:(Qo=0,bf=o):Qo=0,Li(),null}function Kr(){if(Mr!==null){var o=tm($l),a=Kt.transition,f=Rt;try{if(Kt.transition=null,Rt=16>o?16:o,Mr===null)var v=!1;else{if(o=Mr,Mr=null,$l=0,_t&6)throw Error(l(331));var S=_t;for(_t|=4,Re=o.current;Re!==null;){var A=Re,B=A.child;if(Re.flags&16){var k=A.deletions;if(k!==null){for(var oe=0;oe<k.length;oe++){var _e=k[oe];for(Re=_e;Re!==null;){var Ge=Re;switch(Ge.tag){case 0:case 11:case 15:qr(8,Ge,A)}var ut=Ge.child;if(ut!==null)ut.return=Ge,Re=ut;else for(;Re!==null;){Ge=Re;var $e=Ge.sibling,Ft=Ge.return;if(ag(Ge),Ge===_e){Re=null;break}if($e!==null){$e.return=Ft,Re=$e;break}Re=Ft}}}var je=A.alternate;if(je!==null){var An=je.child;if(An!==null){je.child=null;do{var di=An.sibling;An.sibling=null,An=di}while(An!==null)}}Re=A}}if(A.subtreeFlags&2064&&B!==null)B.return=A,Re=B;else e:for(;Re!==null;){if(A=Re,A.flags&2048)switch(A.tag){case 0:case 11:case 15:qr(9,A,A.return)}var $=A.sibling;if($!==null){$.return=A.return,Re=$;break e}Re=A.return}}var W=o.current;for(Re=W;Re!==null;){B=Re;var re=B.child;if(B.subtreeFlags&2064&&re!==null)re.return=B,Re=re;else e:for(B=W;Re!==null;){if(k=Re,k.flags&2048)try{switch(k.tag){case 0:case 11:case 15:Zo(9,k)}}catch(Ze){Vn(k,k.return,Ze)}if(k===B){Re=null;break e}var Pe=k.sibling;if(Pe!==null){Pe.return=k.return,Re=Pe;break e}Re=k.return}}if(_t=S,Li(),Pi&&typeof Pi.onPostCommitFiberRoot=="function")try{Pi.onPostCommitFiberRoot(vl,o)}catch{}v=!0}return v}finally{Rt=f,Kt.transition=a}}return!1}function Eg(o,a,f){a=af(f,a),a=Bm(o,a,1),xr(o,a),a=Un(),o=nc(o,1),o!==null&&(No(o,1,a),Hn(o,a))}function Vn(o,a,f){if(o.tag===3)Eg(o,o,f);else for(;a!==null;){if(a.tag===3){Eg(a,o,f);break}else if(a.tag===1){var v=a.stateNode;if(typeof a.type.getDerivedStateFromError=="function"||typeof v.componentDidCatch=="function"&&(Sr===null||!Sr.has(v))){o=af(f,o),o=zm(a,o,1),xr(a,o),o=Un(),a=nc(a,1),a!==null&&(No(a,1,o),Hn(a,o));break}}a=a.return}}function kx(o,a,f){var v=o.pingCache;v!==null&&v.delete(a),a=Un(),o.pingedLanes|=o.suspendedLanes&f,$t===o&&(vn&f)===f&&(sn===4||sn===3&&(vn&130023424)===vn&&500>ln()-Ef?Zr(o,0):wf|=f),Hn(o,a)}function Ag(o,a){a===0&&(o.mode&1?(a=ml,ml<<=1,!(ml&130023424)&&(ml=4194304)):a=1);var f=Un();o=nc(o,a),o!==null&&(No(o,a,f),Hn(o,f))}function Hx(o){var a=o.memoizedState,f=0;a!==null&&(f=a.retryLane),Ag(o,f)}function Vx(o,a){var f=0;switch(o.tag){case 13:var v=o.stateNode,S=o.memoizedState;S!==null&&(f=S.retryLane);break;case 19:v=o.stateNode;break;default:throw Error(l(314))}v!==null&&v.delete(a),Ag(o,f)}var Tg;Tg=function(o,a,f){if(o!==null)if(o.memoizedProps!==a.pendingProps||lt.current)Qn=!0;else{if(!(o.lanes&f)&&!(a.flags&128))return Qn=!1,Rx(o,a,f);Qn=!!(o.flags&131072)}else Qn=!1,Vt&&a.flags&1048576&&fm(a,Tl,a.index);switch(a.lanes=0,a.tag){case 2:var v=a.type;o!==null&&(o.alternate=null,a.alternate=null,a.flags|=2),o=a.pendingProps;var S=Jn(a,Et.current);Fs(a,f),S=tf(null,a,v,o,S,f);var A=nf();return a.flags|=1,typeof S=="object"&&S!==null&&typeof S.render=="function"&&S.$$typeof===void 0?(a.tag=1,a.memoizedState=null,a.updateQueue=null,Ot(v)?(A=!0,_r(a)):A=!1,a.memoizedState=S.state!==null&&S.state!==void 0?S.state:null,Vh(a),S.updater=El,a.stateNode=S,S._reactInternals=a,Wh(a,v,o,f),a=uf(null,a,v,!0,A,f)):(a.tag=0,Vt&&A&&Xh(a),Dn(null,a,S,f),a=a.child),a;case 16:v=a.elementType;e:{switch(o!==null&&(o.alternate=null,a.alternate=null,a.flags|=2),o=a.pendingProps,S=v._init,v=S(v._payload),a.type=v,S=a.tag=Wx(v),o=_i(v,o),S){case 0:a=cf(null,a,v,o,f);break e;case 1:a=Km(null,a,v,o,f);break e;case 11:a=Xm(null,a,v,o,f);break e;case 14:a=Ym(null,a,v,_i(v.type,o),f);break e}throw Error(l(306,v,""))}return a;case 0:return v=a.type,S=a.pendingProps,S=a.elementType===v?S:_i(v,S),cf(o,a,v,S,f);case 1:return v=a.type,S=a.pendingProps,S=a.elementType===v?S:_i(v,S),Km(o,a,v,S,f);case 3:e:{if(jm(a),o===null)throw Error(l(387));v=a.pendingProps,A=a.memoizedState,S=A.element,sm(o,a),wl(a,v,null,f);var B=a.memoizedState;if(v=B.element,N&&A.isDehydrated)if(A={element:v,isDehydrated:!1,cache:B.cache,transitions:B.transitions},a.updateQueue.baseState=A,a.memoizedState=A,a.flags&256){S=Error(l(423)),a=Qm(o,a,v,f,S);break e}else if(v!==S){S=Error(l(424)),a=Qm(o,a,v,f,S);break e}else for(N&&(jn=Ns(a.stateNode.containerInfo),Kn=a,Vt=!0,yi=null,Oo=!1),f=_m(a,null,v,f),a.child=f;f;)f.flags=f.flags&-3|4096,f=f.sibling;else{if(ks(),v===S){a=er(o,a,f);break e}Dn(o,a,v,f)}a=a.child}return a;case 5:return ym(a),o===null&&Zh(a),v=a.type,S=a.pendingProps,A=o!==null?o.memoizedProps:null,B=S.children,de(v,S)?B=null:A!==null&&de(v,A)&&(a.flags|=32),Jm(o,a),Dn(o,a,B,f),a.child;case 6:return o===null&&Zh(a),null;case 13:return $m(o,a,f);case 4:return Kh(a,a.stateNode.containerInfo),v=a.pendingProps,o===null?a.child=Hs(a,null,v,f):Dn(o,a,v,f),a.child;case 11:return v=a.type,S=a.pendingProps,S=a.elementType===v?S:_i(v,S),Xm(o,a,v,S,f);case 7:return Dn(o,a,a.pendingProps,f),a.child;case 8:return Dn(o,a,a.pendingProps.children,f),a.child;case 12:return Dn(o,a,a.pendingProps.children,f),a.child;case 10:e:{if(v=a.type._context,S=a.pendingProps,A=a.memoizedProps,B=S.value,rm(a,v,B),A!==null)if(Ii(A.value,B)){if(A.children===S.children&&!lt.current){a=er(o,a,f);break e}}else for(A=a.child,A!==null&&(A.return=a);A!==null;){var k=A.dependencies;if(k!==null){B=A.child;for(var oe=k.firstContext;oe!==null;){if(oe.context===v){if(A.tag===1){oe=Ki(-1,f&-f),oe.tag=2;var _e=A.updateQueue;if(_e!==null){_e=_e.shared;var Ge=_e.pending;Ge===null?oe.next=oe:(oe.next=Ge.next,Ge.next=oe),_e.pending=oe}}A.lanes|=f,oe=A.alternate,oe!==null&&(oe.lanes|=f),Hh(A.return,f,a),k.lanes|=f;break}oe=oe.next}}else if(A.tag===10)B=A.type===a.type?null:A.child;else if(A.tag===18){if(B=A.return,B===null)throw Error(l(341));B.lanes|=f,k=B.alternate,k!==null&&(k.lanes|=f),Hh(B,f,a),B=A.sibling}else B=A.child;if(B!==null)B.return=A;else for(B=A;B!==null;){if(B===a){B=null;break}if(A=B.sibling,A!==null){A.return=B.return,B=A;break}B=B.return}A=B}Dn(o,a,S.children,f),a=a.child}return a;case 9:return S=a.type,v=a.pendingProps.children,Fs(a,f),S=oi(S),v=v(S),a.flags|=1,Dn(o,a,v,f),a.child;case 14:return v=a.type,S=_i(v,a.pendingProps),S=_i(v.type,S),Ym(o,a,v,S,f);case 15:return qm(o,a,a.type,a.pendingProps,f);case 17:return v=a.type,S=a.pendingProps,S=a.elementType===v?S:_i(v,S),o!==null&&(o.alternate=null,a.alternate=null,a.flags|=2),a.tag=1,Ot(v)?(o=!0,_r(a)):o=!1,Fs(a,f),um(a,v,S),Wh(a,v,S,f),uf(null,a,v,!0,o,f);case 19:return ig(o,a,f);case 22:return Zm(o,a,f)}throw Error(l(156,a.tag))};function bg(o,a){return Uh(o,a)}function Gx(o,a,f,v){this.tag=o,this.key=f,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=a,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=v,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function fi(o,a,f,v){return new Gx(o,a,f,v)}function Lf(o){return o=o.prototype,!(!o||!o.isReactComponent)}function Wx(o){if(typeof o=="function")return Lf(o)?1:0;if(o!=null){if(o=o.$$typeof,o===M)return 11;if(o===E)return 14}return 2}function Ar(o,a){var f=o.alternate;return f===null?(f=fi(o.tag,a,o.key,o.mode),f.elementType=o.elementType,f.type=o.type,f.stateNode=o.stateNode,f.alternate=o,o.alternate=f):(f.pendingProps=a,f.type=o.type,f.flags=0,f.subtreeFlags=0,f.deletions=null),f.flags=o.flags&14680064,f.childLanes=o.childLanes,f.lanes=o.lanes,f.child=o.child,f.memoizedProps=o.memoizedProps,f.memoizedState=o.memoizedState,f.updateQueue=o.updateQueue,a=o.dependencies,f.dependencies=a===null?null:{lanes:a.lanes,firstContext:a.firstContext},f.sibling=o.sibling,f.index=o.index,f.ref=o.ref,f}function rc(o,a,f,v,S,A){var B=2;if(v=o,typeof o=="function")Lf(o)&&(B=1);else if(typeof o=="string")B=5;else e:switch(o){case d:return jr(f.children,S,A,a);case p:B=8,S|=8;break;case m:return o=fi(12,f,a,S|2),o.elementType=m,o.lanes=A,o;case x:return o=fi(13,f,a,S),o.elementType=x,o.lanes=A,o;case _:return o=fi(19,f,a,S),o.elementType=_,o.lanes=A,o;case T:return sc(f,S,A,a);default:if(typeof o=="object"&&o!==null)switch(o.$$typeof){case g:B=10;break e;case y:B=9;break e;case M:B=11;break e;case E:B=14;break e;case w:B=16,v=null;break e}throw Error(l(130,o==null?o:typeof o,""))}return a=fi(B,f,a,S),a.elementType=o,a.type=v,a.lanes=A,a}function jr(o,a,f,v){return o=fi(7,o,v,a),o.lanes=f,o}function sc(o,a,f,v){return o=fi(22,o,v,a),o.elementType=T,o.lanes=f,o.stateNode={},o}function Df(o,a,f){return o=fi(6,o,null,a),o.lanes=f,o}function Uf(o,a,f){return a=fi(4,o.children!==null?o.children:[],o.key,a),a.lanes=f,a.stateNode={containerInfo:o.containerInfo,pendingChildren:null,implementation:o.implementation},a}function Xx(o,a,f,v,S){this.tag=a,this.containerInfo=o,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=Qe,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Lh(0),this.expirationTimes=Lh(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Lh(0),this.identifierPrefix=v,this.onRecoverableError=S,N&&(this.mutableSourceEagerHydrationData=null)}function Cg(o,a,f,v,S,A,B,k,oe){return o=new Xx(o,a,f,k,oe),a===1?(a=1,A===!0&&(a|=8)):a=0,A=fi(3,null,null,a),o.current=A,A.stateNode=o,A.memoizedState={element:v,isDehydrated:f,cache:null,transitions:null},Vh(A),o}function Rg(o){if(!o)return We;o=o._reactInternals;e:{if(X(o)!==o||o.tag!==1)throw Error(l(170));var a=o;do{switch(a.tag){case 3:a=a.stateNode.context;break e;case 1:if(Ot(a.type)){a=a.stateNode.__reactInternalMemoizedMergedChildContext;break e}}a=a.return}while(a!==null);throw Error(l(171))}if(o.tag===1){var f=o.type;if(Ot(f))return vi(o,f,a)}return a}function Pg(o){var a=o._reactInternals;if(a===void 0)throw typeof o.render=="function"?Error(l(188)):(o=Object.keys(o).join(","),Error(l(268,o)));return o=G(a),o===null?null:o.stateNode}function Ig(o,a){if(o=o.memoizedState,o!==null&&o.dehydrated!==null){var f=o.retryLane;o.retryLane=f!==0&&f<a?f:a}}function Nf(o,a){Ig(o,a),(o=o.alternate)&&Ig(o,a)}function Yx(o){return o=G(o),o===null?null:o.stateNode}function qx(){return null}return t.attemptContinuousHydration=function(o){if(o.tag===13){var a=Un();hi(o,134217728,a),Nf(o,134217728)}},t.attemptHydrationAtCurrentPriority=function(o){if(o.tag===13){var a=Un(),f=wr(o);hi(o,f,a),Nf(o,f)}},t.attemptSynchronousHydration=function(o){switch(o.tag){case 3:var a=o.stateNode;if(a.current.memoizedState.isDehydrated){var f=Uo(a.pendingLanes);f!==0&&(Dh(a,f|1),Hn(a,ln()),!(_t&6)&&(qs(),Li()))}break;case 13:var v=Un();yg(function(){return hi(o,1,v)}),Nf(o,1)}},t.batchedUpdates=function(o,a){var f=_t;_t|=1;try{return o(a)}finally{_t=f,_t===0&&(qs(),_l&&Li())}},t.createComponentSelector=function(o){return{$$typeof:Wl,value:o}},t.createContainer=function(o,a,f,v,S,A,B){return Cg(o,a,!1,null,f,v,S,A,B)},t.createHasPseudoClassSelector=function(o){return{$$typeof:Xl,value:o}},t.createHydrationContainer=function(o,a,f,v,S,A,B,k,oe){return o=Cg(f,v,!0,o,S,A,B,k,oe),o.context=Rg(null),f=o.current,v=Un(),S=wr(f),A=Ki(v,S),A.callback=a??null,xr(f,A),o.current.lanes=S,No(o,S,v),Hn(o,v),o},t.createPortal=function(o,a,f){var v=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:h,key:v==null?null:""+v,children:o,containerInfo:a,implementation:f}},t.createRoleSelector=function(o){return{$$typeof:Yl,value:o}},t.createTestNameSelector=function(o){return{$$typeof:ql,value:o}},t.createTextSelector=function(o){return{$$typeof:Zl,value:o}},t.deferredUpdates=function(o){var a=Rt,f=Kt.transition;try{return Kt.transition=null,Rt=16,o()}finally{Rt=a,Kt.transition=f}},t.discreteUpdates=function(o,a,f,v,S){var A=Rt,B=Kt.transition;try{return Kt.transition=null,Rt=1,o(a,f,v,S)}finally{Rt=A,Kt.transition=B,_t===0&&qs()}},t.findAllNodes=Sf,t.findBoundingRects=function(o,a){if(!U)throw Error(l(363));a=Sf(o,a),o=[];for(var f=0;f<a.length;f++)o.push(j(a[f]));for(a=o.length-1;0<a;a--){f=o[a];for(var v=f.x,S=v+f.width,A=f.y,B=A+f.height,k=a-1;0<=k;k--)if(a!==k){var oe=o[k],_e=oe.x,Ge=_e+oe.width,ut=oe.y,$e=ut+oe.height;if(v>=_e&&A>=ut&&S<=Ge&&B<=$e){o.splice(a,1);break}else if(v!==_e||f.width!==oe.width||$e<A||ut>B){if(!(A!==ut||f.height!==oe.height||Ge<v||_e>S)){_e>v&&(oe.width+=_e-v,oe.x=v),Ge<S&&(oe.width=S-_e),o.splice(a,1);break}}else{ut>A&&(oe.height+=ut-A,oe.y=A),$e<B&&(oe.height=B-ut),o.splice(a,1);break}}}return o},t.findHostInstance=Pg,t.findHostInstanceWithNoPortals=function(o){return o=C(o),o=o!==null?Q(o):null,o===null?null:o.stateNode},t.findHostInstanceWithWarning=function(o){return Pg(o)},t.flushControlled=function(o){var a=_t;_t|=1;var f=Kt.transition,v=Rt;try{Kt.transition=null,Rt=1,o()}finally{Rt=v,Kt.transition=f,_t=a,_t===0&&(qs(),Li())}},t.flushPassiveEffects=Kr,t.flushSync=yg,t.focusWithin=function(o,a){if(!U)throw Error(l(363));for(o=_f(o),a=gg(o,a),a=Array.from(a),o=0;o<a.length;){var f=a[o++];if(!ue(f)){if(f.tag===5&&Ye(f.stateNode))return!0;for(f=f.child;f!==null;)a.push(f),f=f.sibling}}return!1},t.getCurrentUpdatePriority=function(){return Rt},t.getFindAllNodesFailureDescription=function(o,a){if(!U)throw Error(l(363));var f=0,v=[];o=[_f(o),0];for(var S=0;S<o.length;){var A=o[S++],B=o[S++],k=a[B];if((A.tag!==5||!ue(A))&&(yf(A,k)&&(v.push(xf(k)),B++,B>f&&(f=B)),B<a.length))for(A=A.child;A!==null;)o.push(A,B),A=A.sibling}if(f<a.length){for(o=[];f<a.length;f++)o.push(xf(a[f]));return`findAllNodes was able to match part of the selector:
  `+(v.join(" > ")+`

No matching component was found for:
  `)+o.join(" > ")}return null},t.getPublicRootInstance=function(o){if(o=o.current,!o.child)return null;switch(o.child.tag){case 5:return K(o.child.stateNode);default:return o.child.stateNode}},t.injectIntoDevTools=function(o){if(o={bundleType:o.bundleType,version:o.version,rendererPackageName:o.rendererPackageName,rendererConfig:o.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:c.ReactCurrentDispatcher,findHostInstanceByFiber:Yx,findFiberByHostInstance:o.findFiberByHostInstance||qx,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.0.0-fc46dba67-20220329"},typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u")o=!1;else{var a=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(a.isDisabled||!a.supportsFiber)o=!0;else{try{vl=a.inject(o),Pi=a}catch{}o=!!a.checkDCE}}return o},t.isAlreadyRendering=function(){return!1},t.observeVisibleRects=function(o,a,f,v){if(!U)throw Error(l(363));o=Sf(o,a);var S=Ce(o,f,v).disconnect;return{disconnect:function(){S()}}},t.registerMutableSourceForHydration=function(o,a){var f=a._getVersion;f=f(a._source),o.mutableSourceEagerHydrationData==null?o.mutableSourceEagerHydrationData=[a,f]:o.mutableSourceEagerHydrationData.push(a,f)},t.runWithPriority=function(o,a){var f=Rt;try{return Rt=o,a()}finally{Rt=f}},t.shouldError=function(){return null},t.shouldSuspend=function(){return!1},t.updateContainer=function(o,a,f,v){var S=a.current,A=Un(),B=wr(S);return f=Rg(f),a.context===null?a.context=f:a.pendingContext=f,a=Ki(A,B),a.payload={element:o},v=v===void 0?null:v,v!==null&&(a.callback=v),xr(S,a),o=hi(S,B,A),o!==null&&Ml(o,S,B),B},t};Fy.exports=vC;var _C=Fy.exports;const yC=Jx(_C);var By={exports:{}},zy={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(r){function e(F,J){var Z=F.length;F.push(J);e:for(;0<Z;){var ie=Z-1>>>1,xe=F[ie];if(0<i(xe,J))F[ie]=J,F[Z]=xe,Z=ie;else break e}}function t(F){return F.length===0?null:F[0]}function n(F){if(F.length===0)return null;var J=F[0],Z=F.pop();if(Z!==J){F[0]=Z;e:for(var ie=0,xe=F.length,ze=xe>>>1;ie<ze;){var ne=2*(ie+1)-1,de=F[ne],Me=ne+1,ye=F[Me];if(0>i(de,Z))Me<xe&&0>i(ye,de)?(F[ie]=ye,F[Me]=Z,ie=Me):(F[ie]=de,F[ne]=Z,ie=ne);else if(Me<xe&&0>i(ye,Z))F[ie]=ye,F[Me]=Z,ie=Me;else break e}}return J}function i(F,J){var Z=F.sortIndex-J.sortIndex;return Z!==0?Z:F.id-J.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;r.unstable_now=function(){return s.now()}}else{var l=Date,c=l.now();r.unstable_now=function(){return l.now()-c}}var u=[],h=[],d=1,p=null,m=3,g=!1,y=!1,M=!1,x=typeof setTimeout=="function"?setTimeout:null,_=typeof clearTimeout=="function"?clearTimeout:null,E=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function w(F){for(var J=t(h);J!==null;){if(J.callback===null)n(h);else if(J.startTime<=F)n(h),J.sortIndex=J.expirationTime,e(u,J);else break;J=t(h)}}function T(F){if(M=!1,w(F),!y)if(t(u)!==null)y=!0,K(O);else{var J=t(h);J!==null&&me(T,J.startTime-F)}}function O(F,J){y=!1,M&&(M=!1,_(z),z=-1),g=!0;var Z=m;try{for(w(J),p=t(u);p!==null&&(!(p.expirationTime>J)||F&&!C());){var ie=p.callback;if(typeof ie=="function"){p.callback=null,m=p.priorityLevel;var xe=ie(p.expirationTime<=J);J=r.unstable_now(),typeof xe=="function"?p.callback=xe:p===t(u)&&n(u),w(J)}else n(u);p=t(u)}if(p!==null)var ze=!0;else{var ne=t(h);ne!==null&&me(T,ne.startTime-J),ze=!1}return ze}finally{p=null,m=Z,g=!1}}var P=!1,L=null,z=-1,X=5,b=-1;function C(){return!(r.unstable_now()-b<X)}function G(){if(L!==null){var F=r.unstable_now();b=F;var J=!0;try{J=L(!0,F)}finally{J?q():(P=!1,L=null)}}else P=!1}var q;if(typeof E=="function")q=function(){E(G)};else if(typeof MessageChannel<"u"){var Q=new MessageChannel,ae=Q.port2;Q.port1.onmessage=G,q=function(){ae.postMessage(null)}}else q=function(){x(G,0)};function K(F){L=F,P||(P=!0,q())}function me(F,J){z=x(function(){F(r.unstable_now())},J)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(F){F.callback=null},r.unstable_continueExecution=function(){y||g||(y=!0,K(O))},r.unstable_forceFrameRate=function(F){0>F||125<F?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):X=0<F?Math.floor(1e3/F):5},r.unstable_getCurrentPriorityLevel=function(){return m},r.unstable_getFirstCallbackNode=function(){return t(u)},r.unstable_next=function(F){switch(m){case 1:case 2:case 3:var J=3;break;default:J=m}var Z=m;m=J;try{return F()}finally{m=Z}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function(F,J){switch(F){case 1:case 2:case 3:case 4:case 5:break;default:F=3}var Z=m;m=F;try{return J()}finally{m=Z}},r.unstable_scheduleCallback=function(F,J,Z){var ie=r.unstable_now();switch(typeof Z=="object"&&Z!==null?(Z=Z.delay,Z=typeof Z=="number"&&0<Z?ie+Z:ie):Z=ie,F){case 1:var xe=-1;break;case 2:xe=250;break;case 5:xe=1073741823;break;case 4:xe=1e4;break;default:xe=5e3}return xe=Z+xe,F={id:d++,callback:J,priorityLevel:F,startTime:Z,expirationTime:xe,sortIndex:-1},Z>ie?(F.sortIndex=Z,e(h,F),t(u)===null&&F===t(h)&&(M?(_(z),z=-1):M=!0,me(T,Z-ie))):(F.sortIndex=xe,e(u,F),y||g||(y=!0,K(O))),F},r.unstable_shouldYield=C,r.unstable_wrapCallback=function(F){var J=m;return function(){var Z=m;m=J;try{return F.apply(this,arguments)}finally{m=Z}}}})(zy);By.exports=zy;var dv=By.exports;const jp={},xC=r=>void Object.assign(jp,r);function SC(r,e){function t(d,{args:p=[],attach:m,...g},y){let M=`${d[0].toUpperCase()}${d.slice(1)}`,x;if(d==="primitive"){if(g.object===void 0)throw new Error("R3F: Primitives without 'object' are invalid!");const _=g.object;x=mo(_,{type:d,root:y,attach:m,primitive:!0})}else{const _=jp[M];if(!_)throw new Error(`R3F: ${M} is not part of the THREE namespace! Did you forget to extend? See: https://docs.pmnd.rs/react-three-fiber/api/objects#using-3rd-party-objects-declaratively`);if(!Array.isArray(p))throw new Error("R3F: The args prop must be an array!");x=mo(new _(...p),{type:d,root:y,attach:m,memoizedProps:{args:p}})}return x.__r3f.attach===void 0&&(x.isBufferGeometry?x.__r3f.attach="geometry":x.isMaterial&&(x.__r3f.attach="material")),M!=="inject"&&Pd(x,g),x}function n(d,p){let m=!1;if(p){var g,y;(g=p.__r3f)!=null&&g.attach?Rd(d,p,p.__r3f.attach):p.isObject3D&&d.isObject3D&&(d.add(p),m=!0),m||(y=d.__r3f)==null||y.objects.push(p),p.__r3f||mo(p,{}),p.__r3f.parent=d,sp(p),go(p)}}function i(d,p,m){let g=!1;if(p){var y,M;if((y=p.__r3f)!=null&&y.attach)Rd(d,p,p.__r3f.attach);else if(p.isObject3D&&d.isObject3D){p.parent=d,p.dispatchEvent({type:"added"}),d.dispatchEvent({type:"childadded",child:p});const x=d.children.filter(E=>E!==p),_=x.indexOf(m);d.children=[...x.slice(0,_),p,...x.slice(_)],g=!0}g||(M=d.__r3f)==null||M.objects.push(p),p.__r3f||mo(p,{}),p.__r3f.parent=d,sp(p),go(p)}}function s(d,p,m=!1){d&&[...d].forEach(g=>l(p,g,m))}function l(d,p,m){if(p){var g,y,M;if(p.__r3f&&(p.__r3f.parent=null),(g=d.__r3f)!=null&&g.objects&&(d.__r3f.objects=d.__r3f.objects.filter(T=>T!==p)),(y=p.__r3f)!=null&&y.attach)_v(d,p,p.__r3f.attach);else if(p.isObject3D&&d.isObject3D){var x;d.remove(p),(x=p.__r3f)!=null&&x.root&&CC(su(p),p)}const E=(M=p.__r3f)==null?void 0:M.primitive,w=!E&&(m===void 0?p.dispose!==null:m);if(!E){var _;s((_=p.__r3f)==null?void 0:_.objects,p,w),s(p.children,p,w)}if(delete p.__r3f,w&&p.dispose&&p.type!=="Scene"){const T=()=>{try{p.dispose()}catch{}};typeof IS_REACT_ACT_ENVIRONMENT>"u"?dv.unstable_scheduleCallback(dv.unstable_IdlePriority,T):T()}go(d)}}function c(d,p,m,g){var y;const M=(y=d.__r3f)==null?void 0:y.parent;if(!M)return;const x=t(p,m,d.__r3f.root);if(d.children){for(const _ of d.children)_.__r3f&&n(x,_);d.children=d.children.filter(_=>!_.__r3f)}d.__r3f.objects.forEach(_=>n(x,_)),d.__r3f.objects=[],d.__r3f.autoRemovedBeforeAppend||l(M,d),x.parent&&(x.__r3f.autoRemovedBeforeAppend=!0),n(M,x),x.raycast&&x.__r3f.eventCount&&su(x).getState().internal.interaction.push(x),[g,g.alternate].forEach(_=>{_!==null&&(_.stateNode=x,_.ref&&(typeof _.ref=="function"?_.ref(x):_.ref.current=x))})}const u=()=>{};return{reconciler:yC({createInstance:t,removeChild:l,appendChild:n,appendInitialChild:n,insertBefore:i,supportsMutation:!0,isPrimaryRenderer:!1,supportsPersistence:!1,supportsHydration:!1,noTimeout:-1,appendChildToContainer:(d,p)=>{if(!p)return;const m=d.getState().scene;m.__r3f&&(m.__r3f.root=d,n(m,p))},removeChildFromContainer:(d,p)=>{p&&l(d.getState().scene,p)},insertInContainerBefore:(d,p,m)=>{if(!p||!m)return;const g=d.getState().scene;g.__r3f&&i(g,p,m)},getRootHostContext:()=>null,getChildHostContext:d=>d,finalizeInitialChildren(d){var p;return!!((p=d==null?void 0:d.__r3f)!=null?p:{}).handlers},prepareUpdate(d,p,m,g){var y;if(((y=d==null?void 0:d.__r3f)!=null?y:{}).primitive&&g.object&&g.object!==d)return[!0];{const{args:x=[],children:_,...E}=g,{args:w=[],children:T,...O}=m;if(!Array.isArray(x))throw new Error("R3F: the args prop must be an array!");if(x.some((L,z)=>L!==w[z]))return[!0];const P=Yy(d,E,O,!0);return P.changes.length?[!1,P]:null}},commitUpdate(d,[p,m],g,y,M,x){p?c(d,g,M,x):Pd(d,m)},commitMount(d,p,m,g){var y;const M=(y=d.__r3f)!=null?y:{};d.raycast&&M.handlers&&M.eventCount&&su(d).getState().internal.interaction.push(d)},getPublicInstance:d=>d,prepareForCommit:()=>null,preparePortalMount:d=>mo(d.getState().scene),resetAfterCommit:()=>{},shouldSetTextContent:()=>!1,clearContainer:()=>!1,hideInstance(d){var p;const{attach:m,parent:g}=(p=d.__r3f)!=null?p:{};m&&g&&_v(g,d,m),d.isObject3D&&(d.visible=!1),go(d)},unhideInstance(d,p){var m;const{attach:g,parent:y}=(m=d.__r3f)!=null?m:{};g&&y&&Rd(y,d,g),(d.isObject3D&&p.visible==null||p.visible)&&(d.visible=!0),go(d)},createTextInstance:u,hideTextInstance:u,unhideTextInstance:u,getCurrentEventPriority:()=>e?e():Mo.DefaultEventPriority,beforeActiveInstanceBlur:()=>{},afterActiveInstanceBlur:()=>{},detachDeletedInstance:()=>{},now:typeof performance<"u"&&kt.fun(performance.now)?performance.now:kt.fun(Date.now)?Date.now:()=>0,scheduleTimeout:kt.fun(setTimeout)?setTimeout:void 0,cancelTimeout:kt.fun(clearTimeout)?clearTimeout:void 0}),applyProps:Pd}}var pv,mv;const Cd=r=>"colorSpace"in r||"outputColorSpace"in r,ky=()=>{var r;return(r=jp.ColorManagement)!=null?r:null},Hy=r=>r&&r.isOrthographicCamera,MC=r=>r&&r.hasOwnProperty("current"),ol=typeof window<"u"&&((pv=window.document)!=null&&pv.createElement||((mv=window.navigator)==null?void 0:mv.product)==="ReactNative")?Ee.useLayoutEffect:Ee.useEffect;function Vy(r){const e=Ee.useRef(r);return ol(()=>void(e.current=r),[r]),e}function wC({set:r}){return ol(()=>(r(new Promise(()=>null)),()=>r(!1)),[r]),null}class Gy extends Ee.Component{constructor(...e){super(...e),this.state={error:!1}}componentDidCatch(e){this.props.set(e)}render(){return this.state.error?null:this.props.children}}Gy.getDerivedStateFromError=()=>({error:!0});const Wy="__default",gv=new Map,EC=r=>r&&!!r.memoized&&!!r.changes;function Xy(r){var e;const t=typeof window<"u"?(e=window.devicePixelRatio)!=null?e:2:1;return Array.isArray(r)?Math.min(Math.max(r[0],t),r[1]):r}const fa=r=>{var e;return(e=r.__r3f)==null?void 0:e.root.getState()};function su(r){let e=r.__r3f.root;for(;e.getState().previousRoot;)e=e.getState().previousRoot;return e}const kt={obj:r=>r===Object(r)&&!kt.arr(r)&&typeof r!="function",fun:r=>typeof r=="function",str:r=>typeof r=="string",num:r=>typeof r=="number",boo:r=>typeof r=="boolean",und:r=>r===void 0,arr:r=>Array.isArray(r),equ(r,e,{arrays:t="shallow",objects:n="reference",strict:i=!0}={}){if(typeof r!=typeof e||!!r!=!!e)return!1;if(kt.str(r)||kt.num(r)||kt.boo(r))return r===e;const s=kt.obj(r);if(s&&n==="reference")return r===e;const l=kt.arr(r);if(l&&t==="reference")return r===e;if((l||s)&&r===e)return!0;let c;for(c in r)if(!(c in e))return!1;if(s&&t==="shallow"&&n==="shallow"){for(c in i?e:r)if(!kt.equ(r[c],e[c],{strict:i,objects:"reference"}))return!1}else for(c in i?e:r)if(r[c]!==e[c])return!1;if(kt.und(c)){if(l&&r.length===0&&e.length===0||s&&Object.keys(r).length===0&&Object.keys(e).length===0)return!0;if(r!==e)return!1}return!0}};function AC(r){r.dispose&&r.type!=="Scene"&&r.dispose();for(const e in r)e.dispose==null||e.dispose(),delete r[e]}function mo(r,e){const t=r;return t.__r3f={type:"",root:null,previousAttach:null,memoizedProps:{},eventCount:0,handlers:{},objects:[],parent:null,...e},r}function rp(r,e){let t=r;if(e.includes("-")){const n=e.split("-"),i=n.pop();return t=n.reduce((s,l)=>s[l],r),{target:t,key:i}}else return{target:t,key:e}}const vv=/-\d+$/;function Rd(r,e,t){if(kt.str(t)){if(vv.test(t)){const s=t.replace(vv,""),{target:l,key:c}=rp(r,s);Array.isArray(l[c])||(l[c]=[])}const{target:n,key:i}=rp(r,t);e.__r3f.previousAttach=n[i],n[i]=e}else e.__r3f.previousAttach=t(r,e)}function _v(r,e,t){var n,i;if(kt.str(t)){const{target:s,key:l}=rp(r,t),c=e.__r3f.previousAttach;c===void 0?delete s[l]:s[l]=c}else(n=e.__r3f)==null||n.previousAttach==null||n.previousAttach(r,e);(i=e.__r3f)==null||delete i.previousAttach}function Yy(r,{children:e,key:t,ref:n,...i},{children:s,key:l,ref:c,...u}={},h=!1){const d=r.__r3f,p=Object.entries(i),m=[];if(h){const y=Object.keys(u);for(let M=0;M<y.length;M++)i.hasOwnProperty(y[M])||p.unshift([y[M],Wy+"remove"])}p.forEach(([y,M])=>{var x;if((x=r.__r3f)!=null&&x.primitive&&y==="object"||kt.equ(M,u[y]))return;if(/^on(Pointer|Click|DoubleClick|ContextMenu|Wheel)/.test(y))return m.push([y,M,!0,[]]);let _=[];y.includes("-")&&(_=y.split("-")),m.push([y,M,!1,_]);for(const E in i){const w=i[E];E.startsWith(`${y}-`)&&m.push([E,w,!1,E.split("-")])}});const g={...i};return d!=null&&d.memoizedProps&&d!=null&&d.memoizedProps.args&&(g.args=d.memoizedProps.args),d!=null&&d.memoizedProps&&d!=null&&d.memoizedProps.attach&&(g.attach=d.memoizedProps.attach),{memoized:g,changes:m}}function Pd(r,e){var t;const n=r.__r3f,i=n==null?void 0:n.root,s=i==null||i.getState==null?void 0:i.getState(),{memoized:l,changes:c}=EC(e)?e:Yy(r,e),u=n==null?void 0:n.eventCount;r.__r3f&&(r.__r3f.memoizedProps=l);for(let m=0;m<c.length;m++){let[g,y,M,x]=c[m];if(Cd(r)){const T="srgb",O="srgb-linear";g==="encoding"?(g="colorSpace",y=y===3001?T:O):g==="outputEncoding"&&(g="outputColorSpace",y=y===3001?T:O)}let _=r,E=_[g];if(x.length&&(E=x.reduce((w,T)=>w[T],r),!(E&&E.set))){const[w,...T]=x.reverse();_=T.reverse().reduce((O,P)=>O[P],r),g=w}if(y===Wy+"remove")if(_.constructor){let w=gv.get(_.constructor);w||(w=new _.constructor,gv.set(_.constructor,w)),y=w[g]}else y=0;if(M&&n)y?n.handlers[g]=y:delete n.handlers[g],n.eventCount=Object.keys(n.handlers).length;else if(E&&E.set&&(E.copy||E instanceof Ss)){if(Array.isArray(y))E.fromArray?E.fromArray(y):E.set(...y);else if(E.copy&&y&&y.constructor&&E.constructor===y.constructor)E.copy(y);else if(y!==void 0){var h;const w=(h=E)==null?void 0:h.isColor;!w&&E.setScalar?E.setScalar(y):E instanceof Ss&&y instanceof Ss?E.mask=y.mask:E.set(y),!ky()&&s&&!s.linear&&w&&E.convertSRGBToLinear()}}else{var d;if(_[g]=y,(d=_[g])!=null&&d.isTexture&&_[g].format===Rn&&_[g].type===Ai&&s){const w=_[g];Cd(w)&&Cd(s.gl)?w.colorSpace=s.gl.outputColorSpace:w.encoding=s.gl.outputEncoding}}go(r)}if(n&&n.parent&&r.raycast&&u!==n.eventCount){const m=su(r).getState().internal,g=m.interaction.indexOf(r);g>-1&&m.interaction.splice(g,1),n.eventCount&&m.interaction.push(r)}return!(c.length===1&&c[0][0]==="onUpdate")&&c.length&&(t=r.__r3f)!=null&&t.parent&&sp(r),r}function go(r){var e,t;const n=(e=r.__r3f)==null||(t=e.root)==null||t.getState==null?void 0:t.getState();n&&n.internal.frames===0&&n.invalidate()}function sp(r){r.onUpdate==null||r.onUpdate(r)}function TC(r,e){r.manual||(Hy(r)?(r.left=e.width/-2,r.right=e.width/2,r.top=e.height/2,r.bottom=e.height/-2):r.aspect=e.width/e.height,r.updateProjectionMatrix(),r.updateMatrixWorld())}function jc(r){return(r.eventObject||r.object).uuid+"/"+r.index+r.instanceId}function bC(){var r;const e=typeof self<"u"&&self||typeof window<"u"&&window;if(!e)return Mo.DefaultEventPriority;switch((r=e.event)==null?void 0:r.type){case"click":case"contextmenu":case"dblclick":case"pointercancel":case"pointerdown":case"pointerup":return Mo.DiscreteEventPriority;case"pointermove":case"pointerout":case"pointerover":case"pointerenter":case"pointerleave":case"wheel":return Mo.ContinuousEventPriority;default:return Mo.DefaultEventPriority}}function qy(r,e,t,n){const i=t.get(e);i&&(t.delete(e),t.size===0&&(r.delete(n),i.target.releasePointerCapture(n)))}function CC(r,e){const{internal:t}=r.getState();t.interaction=t.interaction.filter(n=>n!==e),t.initialHits=t.initialHits.filter(n=>n!==e),t.hovered.forEach((n,i)=>{(n.eventObject===e||n.object===e)&&t.hovered.delete(i)}),t.capturedMap.forEach((n,i)=>{qy(t.capturedMap,e,n,i)})}function RC(r){function e(u){const{internal:h}=r.getState(),d=u.offsetX-h.initialClick[0],p=u.offsetY-h.initialClick[1];return Math.round(Math.sqrt(d*d+p*p))}function t(u){return u.filter(h=>["Move","Over","Enter","Out","Leave"].some(d=>{var p;return(p=h.__r3f)==null?void 0:p.handlers["onPointer"+d]}))}function n(u,h){const d=r.getState(),p=new Set,m=[],g=h?h(d.internal.interaction):d.internal.interaction;for(let _=0;_<g.length;_++){const E=fa(g[_]);E&&(E.raycaster.camera=void 0)}d.previousRoot||d.events.compute==null||d.events.compute(u,d);function y(_){const E=fa(_);if(!E||!E.events.enabled||E.raycaster.camera===null)return[];if(E.raycaster.camera===void 0){var w;E.events.compute==null||E.events.compute(u,E,(w=E.previousRoot)==null?void 0:w.getState()),E.raycaster.camera===void 0&&(E.raycaster.camera=null)}return E.raycaster.camera?E.raycaster.intersectObject(_,!0):[]}let M=g.flatMap(y).sort((_,E)=>{const w=fa(_.object),T=fa(E.object);return!w||!T?_.distance-E.distance:T.events.priority-w.events.priority||_.distance-E.distance}).filter(_=>{const E=jc(_);return p.has(E)?!1:(p.add(E),!0)});d.events.filter&&(M=d.events.filter(M,d));for(const _ of M){let E=_.object;for(;E;){var x;(x=E.__r3f)!=null&&x.eventCount&&m.push({..._,eventObject:E}),E=E.parent}}if("pointerId"in u&&d.internal.capturedMap.has(u.pointerId))for(let _ of d.internal.capturedMap.get(u.pointerId).values())p.has(jc(_.intersection))||m.push(_.intersection);return m}function i(u,h,d,p){const m=r.getState();if(u.length){const g={stopped:!1};for(const y of u){const M=fa(y.object)||m,{raycaster:x,pointer:_,camera:E,internal:w}=M,T=new D(_.x,_.y,0).unproject(E),O=b=>{var C,G;return(C=(G=w.capturedMap.get(b))==null?void 0:G.has(y.eventObject))!=null?C:!1},P=b=>{const C={intersection:y,target:h.target};w.capturedMap.has(b)?w.capturedMap.get(b).set(y.eventObject,C):w.capturedMap.set(b,new Map([[y.eventObject,C]])),h.target.setPointerCapture(b)},L=b=>{const C=w.capturedMap.get(b);C&&qy(w.capturedMap,y.eventObject,C,b)};let z={};for(let b in h){let C=h[b];typeof C!="function"&&(z[b]=C)}let X={...y,...z,pointer:_,intersections:u,stopped:g.stopped,delta:d,unprojectedPoint:T,ray:x.ray,camera:E,stopPropagation(){const b="pointerId"in h&&w.capturedMap.get(h.pointerId);if((!b||b.has(y.eventObject))&&(X.stopped=g.stopped=!0,w.hovered.size&&Array.from(w.hovered.values()).find(C=>C.eventObject===y.eventObject))){const C=u.slice(0,u.indexOf(y));s([...C,y])}},target:{hasPointerCapture:O,setPointerCapture:P,releasePointerCapture:L},currentTarget:{hasPointerCapture:O,setPointerCapture:P,releasePointerCapture:L},nativeEvent:h};if(p(X),g.stopped===!0)break}}return u}function s(u){const{internal:h}=r.getState();for(const d of h.hovered.values())if(!u.length||!u.find(p=>p.object===d.object&&p.index===d.index&&p.instanceId===d.instanceId)){const m=d.eventObject.__r3f,g=m==null?void 0:m.handlers;if(h.hovered.delete(jc(d)),m!=null&&m.eventCount){const y={...d,intersections:u};g.onPointerOut==null||g.onPointerOut(y),g.onPointerLeave==null||g.onPointerLeave(y)}}}function l(u,h){for(let d=0;d<h.length;d++){const p=h[d].__r3f;p==null||p.handlers.onPointerMissed==null||p.handlers.onPointerMissed(u)}}function c(u){switch(u){case"onPointerLeave":case"onPointerCancel":return()=>s([]);case"onLostPointerCapture":return h=>{const{internal:d}=r.getState();"pointerId"in h&&d.capturedMap.has(h.pointerId)&&requestAnimationFrame(()=>{d.capturedMap.has(h.pointerId)&&(d.capturedMap.delete(h.pointerId),s([]))})}}return function(d){const{onPointerMissed:p,internal:m}=r.getState();m.lastEvent.current=d;const g=u==="onPointerMove",y=u==="onClick"||u==="onContextMenu"||u==="onDoubleClick",x=n(d,g?t:void 0),_=y?e(d):0;u==="onPointerDown"&&(m.initialClick=[d.offsetX,d.offsetY],m.initialHits=x.map(w=>w.eventObject)),y&&!x.length&&_<=2&&(l(d,m.interaction),p&&p(d)),g&&s(x);function E(w){const T=w.eventObject,O=T.__r3f,P=O==null?void 0:O.handlers;if(O!=null&&O.eventCount)if(g){if(P.onPointerOver||P.onPointerEnter||P.onPointerOut||P.onPointerLeave){const L=jc(w),z=m.hovered.get(L);z?z.stopped&&w.stopPropagation():(m.hovered.set(L,w),P.onPointerOver==null||P.onPointerOver(w),P.onPointerEnter==null||P.onPointerEnter(w))}P.onPointerMove==null||P.onPointerMove(w)}else{const L=P[u];L?(!y||m.initialHits.includes(T))&&(l(d,m.interaction.filter(z=>!m.initialHits.includes(z))),L(w)):y&&m.initialHits.includes(T)&&l(d,m.interaction.filter(z=>!m.initialHits.includes(z)))}}i(x,d,_,E)}}return{handlePointer:c}}const Zy=r=>!!(r!=null&&r.render),Jy=Ee.createContext(null),PC=(r,e)=>{const t=pC((c,u)=>{const h=new D,d=new D,p=new D;function m(_=u().camera,E=d,w=u().size){const{width:T,height:O,top:P,left:L}=w,z=T/O;E.isVector3?p.copy(E):p.set(...E);const X=_.getWorldPosition(h).distanceTo(p);if(Hy(_))return{width:T/_.zoom,height:O/_.zoom,top:P,left:L,factor:1,distance:X,aspect:z};{const b=_.fov*Math.PI/180,C=2*Math.tan(b/2)*X,G=C*(T/O);return{width:G,height:C,top:P,left:L,factor:T/G,distance:X,aspect:z}}}let g;const y=_=>c(E=>({performance:{...E.performance,current:_}})),M=new fe;return{set:c,get:u,gl:null,camera:null,raycaster:null,events:{priority:1,enabled:!0,connected:!1},xr:null,scene:null,invalidate:(_=1)=>r(u(),_),advance:(_,E)=>e(_,E,u()),legacy:!1,linear:!1,flat:!1,controls:null,clock:new Yp,pointer:M,mouse:M,frameloop:"always",onPointerMissed:void 0,performance:{current:1,min:.5,max:1,debounce:200,regress:()=>{const _=u();g&&clearTimeout(g),_.performance.current!==_.performance.min&&y(_.performance.min),g=setTimeout(()=>y(u().performance.max),_.performance.debounce)}},size:{width:0,height:0,top:0,left:0,updateStyle:!1},viewport:{initialDpr:0,dpr:0,width:0,height:0,top:0,left:0,aspect:0,distance:0,factor:0,getCurrentViewport:m},setEvents:_=>c(E=>({...E,events:{...E.events,..._}})),setSize:(_,E,w,T,O)=>{const P=u().camera,L={width:_,height:E,top:T||0,left:O||0,updateStyle:w};c(z=>({size:L,viewport:{...z.viewport,...m(P,d,L)}}))},setDpr:_=>c(E=>{const w=Xy(_);return{viewport:{...E.viewport,dpr:w,initialDpr:E.viewport.initialDpr||w}}}),setFrameloop:(_="always")=>{const E=u().clock;E.stop(),E.elapsedTime=0,_!=="never"&&(E.start(),E.elapsedTime=0),c(()=>({frameloop:_}))},previousRoot:void 0,internal:{active:!1,priority:0,frames:0,lastEvent:Ee.createRef(),interaction:[],hovered:new Map,subscribers:[],initialClick:[0,0],initialHits:[],capturedMap:new Map,subscribe:(_,E,w)=>{const T=u().internal;return T.priority=T.priority+(E>0?1:0),T.subscribers.push({ref:_,priority:E,store:w}),T.subscribers=T.subscribers.sort((O,P)=>O.priority-P.priority),()=>{const O=u().internal;O!=null&&O.subscribers&&(O.priority=O.priority-(E>0?1:0),O.subscribers=O.subscribers.filter(P=>P.ref!==_))}}}}}),n=t.getState();let i=n.size,s=n.viewport.dpr,l=n.camera;return t.subscribe(()=>{const{camera:c,size:u,viewport:h,gl:d,set:p}=t.getState();if(u.width!==i.width||u.height!==i.height||h.dpr!==s){var m;i=u,s=h.dpr,TC(c,u),d.setPixelRatio(h.dpr);const g=(m=u.updateStyle)!=null?m:typeof HTMLCanvasElement<"u"&&d.domElement instanceof HTMLCanvasElement;d.setSize(u.width,u.height,g)}c!==l&&(l=c,p(g=>({viewport:{...g.viewport,...g.viewport.getCurrentViewport(c)}})))}),t.subscribe(c=>r(c)),t};let Qc,IC=new Set,LC=new Set,DC=new Set;function Id(r,e){if(r.size)for(const{callback:t}of r.values())t(e)}function da(r,e){switch(r){case"before":return Id(IC,e);case"after":return Id(LC,e);case"tail":return Id(DC,e)}}let Ld,Dd;function Ud(r,e,t){let n=e.clock.getDelta();for(e.frameloop==="never"&&typeof r=="number"&&(n=r-e.clock.elapsedTime,e.clock.oldTime=e.clock.elapsedTime,e.clock.elapsedTime=r),Ld=e.internal.subscribers,Qc=0;Qc<Ld.length;Qc++)Dd=Ld[Qc],Dd.ref.current(Dd.store.getState(),n,t);return!e.internal.priority&&e.gl.render&&e.gl.render(e.scene,e.camera),e.internal.frames=Math.max(0,e.internal.frames-1),e.frameloop==="always"?1:e.internal.frames}function UC(r){let e=!1,t=!1,n,i,s;function l(h){i=requestAnimationFrame(l),e=!0,n=0,da("before",h),t=!0;for(const p of r.values()){var d;s=p.store.getState(),s.internal.active&&(s.frameloop==="always"||s.internal.frames>0)&&!((d=s.gl.xr)!=null&&d.isPresenting)&&(n+=Ud(h,s))}if(t=!1,da("after",h),n===0)return da("tail",h),e=!1,cancelAnimationFrame(i)}function c(h,d=1){var p;if(!h)return r.forEach(m=>c(m.store.getState(),d));(p=h.gl.xr)!=null&&p.isPresenting||!h.internal.active||h.frameloop==="never"||(d>1?h.internal.frames=Math.min(60,h.internal.frames+d):t?h.internal.frames=2:h.internal.frames=1,e||(e=!0,requestAnimationFrame(l)))}function u(h,d=!0,p,m){if(d&&da("before",h),p)Ud(h,p,m);else for(const g of r.values())Ud(h,g.store.getState());d&&da("after",h)}return{loop:l,invalidate:c,advance:u}}function Ky(){const r=Ee.useContext(Jy);if(!r)throw new Error("R3F: Hooks can only be used within the Canvas component!");return r}function ga(r=t=>t,e){return Ky()(r,e)}function NC(r,e=0){const t=Ky(),n=t.getState().internal.subscribe,i=Vy(r);return ol(()=>n(i,e,t),[e,n,t]),null}const Co=new Map,{invalidate:yv,advance:xv}=UC(Co),{reconciler:qu,applyProps:fo}=SC(Co,bC),po={objects:"shallow",strict:!1},OC=(r,e)=>{const t=typeof r=="function"?r(e):r;return Zy(t)?t:new V_({powerPreference:"high-performance",canvas:e,antialias:!0,alpha:!0,...r})};function FC(r,e){const t=typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement;if(e){const{width:n,height:i,top:s,left:l,updateStyle:c=t}=e;return{width:n,height:i,top:s,left:l,updateStyle:c}}else if(typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement&&r.parentElement){const{width:n,height:i,top:s,left:l}=r.parentElement.getBoundingClientRect();return{width:n,height:i,top:s,left:l,updateStyle:t}}else if(typeof OffscreenCanvas<"u"&&r instanceof OffscreenCanvas)return{width:r.width,height:r.height,top:0,left:0,updateStyle:t};return{width:0,height:0,top:0,left:0}}function BC(r){const e=Co.get(r),t=e==null?void 0:e.fiber,n=e==null?void 0:e.store;e&&console.warn("R3F.createRoot should only be called once!");const i=typeof reportError=="function"?reportError:console.error,s=n||PC(yv,xv),l=t||qu.createContainer(s,Mo.ConcurrentRoot,null,!1,null,"",i,null);e||Co.set(r,{fiber:l,store:s});let c,u=!1,h;return{configure(d={}){let{gl:p,size:m,scene:g,events:y,onCreated:M,shadows:x=!1,linear:_=!1,flat:E=!1,legacy:w=!1,orthographic:T=!1,frameloop:O="always",dpr:P=[1,2],performance:L,raycaster:z,camera:X,onPointerMissed:b}=d,C=s.getState(),G=C.gl;C.gl||C.set({gl:G=OC(p,r)});let q=C.raycaster;q||C.set({raycaster:q=new Dy});const{params:Q,...ae}=z||{};if(kt.equ(ae,q,po)||fo(q,{...ae}),kt.equ(Q,q.params,po)||fo(q,{params:{...q.params,...Q}}),!C.camera||C.camera===h&&!kt.equ(h,X,po)){h=X;const Z=X instanceof ja,ie=Z?X:T?new el(0,0,0,0,.1,1e3):new fn(75,0,.1,1e3);Z||(ie.position.z=5,X&&(fo(ie,X),("aspect"in X||"left"in X||"right"in X||"bottom"in X||"top"in X)&&(ie.manual=!0,ie.updateProjectionMatrix())),!C.camera&&!(X!=null&&X.rotation)&&ie.lookAt(0,0,0)),C.set({camera:ie}),q.camera=ie}if(!C.scene){let Z;g!=null&&g.isScene?Z=g:(Z=new bp,g&&fo(Z,g)),C.set({scene:mo(Z)})}if(!C.xr){var K;const Z=(ze,ne)=>{const de=s.getState();de.frameloop!=="never"&&xv(ze,!0,de,ne)},ie=()=>{const ze=s.getState();ze.gl.xr.enabled=ze.gl.xr.isPresenting,ze.gl.xr.setAnimationLoop(ze.gl.xr.isPresenting?Z:null),ze.gl.xr.isPresenting||yv(ze)},xe={connect(){const ze=s.getState().gl;ze.xr.addEventListener("sessionstart",ie),ze.xr.addEventListener("sessionend",ie)},disconnect(){const ze=s.getState().gl;ze.xr.removeEventListener("sessionstart",ie),ze.xr.removeEventListener("sessionend",ie)}};typeof((K=G.xr)==null?void 0:K.addEventListener)=="function"&&xe.connect(),C.set({xr:xe})}if(G.shadowMap){const Z=G.shadowMap.enabled,ie=G.shadowMap.type;if(G.shadowMap.enabled=!!x,kt.boo(x))G.shadowMap.type=va;else if(kt.str(x)){var me;const xe={basic:zv,percentage:Ju,soft:va,variance:wi};G.shadowMap.type=(me=xe[x])!=null?me:va}else kt.obj(x)&&Object.assign(G.shadowMap,x);(Z!==G.shadowMap.enabled||ie!==G.shadowMap.type)&&(G.shadowMap.needsUpdate=!0)}const F=ky();F&&("enabled"in F?F.enabled=!w:"legacyMode"in F&&(F.legacyMode=w)),u||fo(G,{outputEncoding:_?3e3:3001,toneMapping:E?Gi:op}),C.legacy!==w&&C.set(()=>({legacy:w})),C.linear!==_&&C.set(()=>({linear:_})),C.flat!==E&&C.set(()=>({flat:E})),p&&!kt.fun(p)&&!Zy(p)&&!kt.equ(p,G,po)&&fo(G,p),y&&!C.events.handlers&&C.set({events:y(s)});const J=FC(r,m);return kt.equ(J,C.size,po)||C.setSize(J.width,J.height,J.updateStyle,J.top,J.left),P&&C.viewport.dpr!==Xy(P)&&C.setDpr(P),C.frameloop!==O&&C.setFrameloop(O),C.onPointerMissed||C.set({onPointerMissed:b}),L&&!kt.equ(L,C.performance,po)&&C.set(Z=>({performance:{...Z.performance,...L}})),c=M,u=!0,this},render(d){return u||this.configure(),qu.updateContainer(Bt.jsx(zC,{store:s,children:d,onCreated:c,rootElement:r}),l,null,()=>{}),s},unmount(){jy(r)}}}function zC({store:r,children:e,onCreated:t,rootElement:n}){return ol(()=>{const i=r.getState();i.set(s=>({internal:{...s.internal,active:!0}})),t&&t(i),r.getState().events.connected||i.events.connect==null||i.events.connect(n)},[]),Bt.jsx(Jy.Provider,{value:r,children:e})}function jy(r,e){const t=Co.get(r),n=t==null?void 0:t.fiber;if(n){const i=t==null?void 0:t.store.getState();i&&(i.internal.active=!1),qu.updateContainer(null,n,null,()=>{i&&setTimeout(()=>{try{var s,l,c,u;i.events.disconnect==null||i.events.disconnect(),(s=i.gl)==null||(l=s.renderLists)==null||l.dispose==null||l.dispose(),(c=i.gl)==null||c.forceContextLoss==null||c.forceContextLoss(),(u=i.gl)!=null&&u.xr&&i.xr.disconnect(),AC(i),Co.delete(r)}catch{}},500)})}}qu.injectIntoDevTools({bundleType:0,rendererPackageName:"@react-three/fiber",version:Ee.version});const Nd={onClick:["click",!1],onContextMenu:["contextmenu",!1],onDoubleClick:["dblclick",!1],onWheel:["wheel",!0],onPointerDown:["pointerdown",!0],onPointerUp:["pointerup",!0],onPointerLeave:["pointerleave",!0],onPointerMove:["pointermove",!0],onPointerCancel:["pointercancel",!0],onLostPointerCapture:["lostpointercapture",!0]};function kC(r){const{handlePointer:e}=RC(r);return{priority:1,enabled:!0,compute(t,n,i){n.pointer.set(t.offsetX/n.size.width*2-1,-(t.offsetY/n.size.height)*2+1),n.raycaster.setFromCamera(n.pointer,n.camera)},connected:void 0,handlers:Object.keys(Nd).reduce((t,n)=>({...t,[n]:e(n)}),{}),update:()=>{var t;const{events:n,internal:i}=r.getState();(t=i.lastEvent)!=null&&t.current&&n.handlers&&n.handlers.onPointerMove(i.lastEvent.current)},connect:t=>{var n;const{set:i,events:s}=r.getState();s.disconnect==null||s.disconnect(),i(l=>({events:{...l.events,connected:t}})),Object.entries((n=s.handlers)!=null?n:[]).forEach(([l,c])=>{const[u,h]=Nd[l];t.addEventListener(u,c,{passive:h})})},disconnect:()=>{const{set:t,events:n}=r.getState();if(n.connected){var i;Object.entries((i=n.handlers)!=null?i:[]).forEach(([s,l])=>{if(n&&n.connected instanceof HTMLElement){const[c]=Nd[s];n.connected.removeEventListener(c,l)}}),t(s=>({events:{...s.events,connected:void 0}}))}}}}function Sv(r,e){let t;return(...n)=>{window.clearTimeout(t),t=window.setTimeout(()=>r(...n),e)}}function HC({debounce:r,scroll:e,polyfill:t,offsetSize:n}={debounce:0,scroll:!1,offsetSize:!1}){const i=t||(typeof window>"u"?class{}:window.ResizeObserver);if(!i)throw new Error("This browser does not support ResizeObserver out of the box. See: https://github.com/react-spring/react-use-measure/#resize-observer-polyfills");const[s,l]=Ee.useState({left:0,top:0,width:0,height:0,bottom:0,right:0,x:0,y:0}),c=Ee.useRef({element:null,scrollContainers:null,resizeObserver:null,lastBounds:s,orientationHandler:null}),u=r?typeof r=="number"?r:r.scroll:null,h=r?typeof r=="number"?r:r.resize:null,d=Ee.useRef(!1);Ee.useEffect(()=>(d.current=!0,()=>void(d.current=!1)));const[p,m,g]=Ee.useMemo(()=>{const _=()=>{if(!c.current.element)return;const{left:E,top:w,width:T,height:O,bottom:P,right:L,x:z,y:X}=c.current.element.getBoundingClientRect(),b={left:E,top:w,width:T,height:O,bottom:P,right:L,x:z,y:X};c.current.element instanceof HTMLElement&&n&&(b.height=c.current.element.offsetHeight,b.width=c.current.element.offsetWidth),Object.freeze(b),d.current&&!XC(c.current.lastBounds,b)&&l(c.current.lastBounds=b)};return[_,h?Sv(_,h):_,u?Sv(_,u):_]},[l,n,u,h]);function y(){c.current.scrollContainers&&(c.current.scrollContainers.forEach(_=>_.removeEventListener("scroll",g,!0)),c.current.scrollContainers=null),c.current.resizeObserver&&(c.current.resizeObserver.disconnect(),c.current.resizeObserver=null),c.current.orientationHandler&&("orientation"in screen&&"removeEventListener"in screen.orientation?screen.orientation.removeEventListener("change",c.current.orientationHandler):"onorientationchange"in window&&window.removeEventListener("orientationchange",c.current.orientationHandler))}function M(){c.current.element&&(c.current.resizeObserver=new i(g),c.current.resizeObserver.observe(c.current.element),e&&c.current.scrollContainers&&c.current.scrollContainers.forEach(_=>_.addEventListener("scroll",g,{capture:!0,passive:!0})),c.current.orientationHandler=()=>{g()},"orientation"in screen&&"addEventListener"in screen.orientation?screen.orientation.addEventListener("change",c.current.orientationHandler):"onorientationchange"in window&&window.addEventListener("orientationchange",c.current.orientationHandler))}const x=_=>{!_||_===c.current.element||(y(),c.current.element=_,c.current.scrollContainers=Qy(_),M())};return GC(g,!!e),VC(m),Ee.useEffect(()=>{y(),M()},[e,g,m]),Ee.useEffect(()=>y,[]),[x,s,p]}function VC(r){Ee.useEffect(()=>{const e=r;return window.addEventListener("resize",e),()=>void window.removeEventListener("resize",e)},[r])}function GC(r,e){Ee.useEffect(()=>{if(e){const t=r;return window.addEventListener("scroll",t,{capture:!0,passive:!0}),()=>void window.removeEventListener("scroll",t,!0)}},[r,e])}function Qy(r){const e=[];if(!r||r===document.body)return e;const{overflow:t,overflowX:n,overflowY:i}=window.getComputedStyle(r);return[t,n,i].some(s=>s==="auto"||s==="scroll")&&e.push(r),[...e,...Qy(r.parentElement)]}const WC=["x","y","top","bottom","left","right","width","height"],XC=(r,e)=>WC.every(t=>r[t]===e[t]);var YC=Object.defineProperty,qC=Object.defineProperties,ZC=Object.getOwnPropertyDescriptors,Mv=Object.getOwnPropertySymbols,JC=Object.prototype.hasOwnProperty,KC=Object.prototype.propertyIsEnumerable,wv=(r,e,t)=>e in r?YC(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,Ev=(r,e)=>{for(var t in e||(e={}))JC.call(e,t)&&wv(r,t,e[t]);if(Mv)for(var t of Mv(e))KC.call(e,t)&&wv(r,t,e[t]);return r},jC=(r,e)=>qC(r,ZC(e)),Av,Tv;typeof window<"u"&&((Av=window.document)!=null&&Av.createElement||((Tv=window.navigator)==null?void 0:Tv.product)==="ReactNative")?Ee.useLayoutEffect:Ee.useEffect;function $y(r,e,t){if(!r)return;if(t(r)===!0)return r;let n=r.child;for(;n;){const i=$y(n,e,t);if(i)return i;n=n.sibling}}function ex(r){try{return Object.defineProperties(r,{_currentRenderer:{get(){return null},set(){}},_currentRenderer2:{get(){return null},set(){}}})}catch{return r}}const bv=console.error;console.error=function(){const r=[...arguments].join("");if(r!=null&&r.startsWith("Warning:")&&r.includes("useContext")){console.error=bv;return}return bv.apply(this,arguments)};const Qp=ex(Ee.createContext(null));class tx extends Ee.Component{render(){return Ee.createElement(Qp.Provider,{value:this._reactInternals},this.props.children)}}function QC(){const r=Ee.useContext(Qp);if(r===null)throw new Error("its-fine: useFiber must be called within a <FiberProvider />!");const e=Ee.useId();return Ee.useMemo(()=>{for(const n of[r,r==null?void 0:r.alternate]){if(!n)continue;const i=$y(n,!1,s=>{let l=s.memoizedState;for(;l;){if(l.memoizedState===e)return!0;l=l.next}});if(i)return i}},[r,e])}function $C(){const r=QC(),[e]=Ee.useState(()=>new Map);e.clear();let t=r;for(;t;){if(t.type&&typeof t.type=="object"){const i=t.type._context===void 0&&t.type.Provider===t.type?t.type:t.type._context;i&&i!==Qp&&!e.has(i)&&e.set(i,Ee.useContext(ex(i)))}t=t.return}return e}function eR(){const r=$C();return Ee.useMemo(()=>Array.from(r.keys()).reduce((e,t)=>n=>Ee.createElement(e,null,Ee.createElement(t.Provider,jC(Ev({},n),{value:r.get(t)}))),e=>Ee.createElement(tx,Ev({},e))),[r])}const tR=Ee.forwardRef(function({children:e,fallback:t,resize:n,style:i,gl:s,events:l=kC,eventSource:c,eventPrefix:u,shadows:h,linear:d,flat:p,legacy:m,orthographic:g,frameloop:y,dpr:M,performance:x,raycaster:_,camera:E,scene:w,onPointerMissed:T,onCreated:O,...P},L){Ee.useMemo(()=>xC(hC),[]);const z=eR(),[X,b]=HC({scroll:!0,debounce:{scroll:50,resize:0},...n}),C=Ee.useRef(null),G=Ee.useRef(null);Ee.useImperativeHandle(L,()=>C.current);const q=Vy(T),[Q,ae]=Ee.useState(!1),[K,me]=Ee.useState(!1);if(Q)throw Q;if(K)throw K;const F=Ee.useRef(null);ol(()=>{const Z=C.current;b.width>0&&b.height>0&&Z&&(F.current||(F.current=BC(Z)),F.current.configure({gl:s,events:l,shadows:h,linear:d,flat:p,legacy:m,orthographic:g,frameloop:y,dpr:M,performance:x,raycaster:_,camera:E,scene:w,size:b,onPointerMissed:(...ie)=>q.current==null?void 0:q.current(...ie),onCreated:ie=>{ie.events.connect==null||ie.events.connect(c?MC(c)?c.current:c:G.current),u&&ie.setEvents({compute:(xe,ze)=>{const ne=xe[u+"X"],de=xe[u+"Y"];ze.pointer.set(ne/ze.size.width*2-1,-(de/ze.size.height)*2+1),ze.raycaster.setFromCamera(ze.pointer,ze.camera)}}),O==null||O(ie)}}),F.current.render(Bt.jsx(z,{children:Bt.jsx(Gy,{set:me,children:Bt.jsx(Ee.Suspense,{fallback:Bt.jsx(wC,{set:ae}),children:e??null})})})))}),Ee.useEffect(()=>{const Z=C.current;if(Z)return()=>jy(Z)},[]);const J=c?"none":"auto";return Bt.jsx("div",{ref:G,style:{position:"relative",width:"100%",height:"100%",overflow:"hidden",pointerEvents:J,...i},...P,children:Bt.jsx("div",{ref:X,style:{width:"100%",height:"100%"},children:Bt.jsx("canvas",{ref:C,style:{display:"block"},children:t})})})}),nR=Ee.forwardRef(function(e,t){return Bt.jsx(tx,{children:Bt.jsx(tR,{...e,ref:t})})});function Zu(){return Zu=Object.assign?Object.assign.bind():function(r){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var n in t)({}).hasOwnProperty.call(t,n)&&(r[n]=t[n])}return r},Zu.apply(null,arguments)}const nx=parseInt(qa.replace(/\D+/g,"")),ix=nx>=125?"uv1":"uv2",Cv=new pn,$c=new D;class $p extends Wp{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new Xe(e,3)),this.setAttribute("uv",new Xe(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const n=new Yu(t,6,1);return this.setAttribute("instanceStart",new ni(n,3,0)),this.setAttribute("instanceEnd",new ni(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));const i=new Yu(n,t*2,1);return this.setAttribute("instanceColorStart",new ni(i,t,0)),this.setAttribute("instanceColorEnd",new ni(i,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new Fp(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new pn);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),Cv.setFromBufferAttribute(t),this.boundingBox.union(Cv))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new mn),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const n=this.boundingSphere.center;this.boundingBox.getCenter(n);let i=0;for(let s=0,l=e.count;s<l;s++)$c.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared($c)),$c.fromBufferAttribute(t,s),i=Math.max(i,n.distanceToSquared($c));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}class rx extends $p{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){const t=e.length-3,n=new Float32Array(2*t);for(let i=0;i<t;i+=3)n[2*i]=e[i],n[2*i+1]=e[i+1],n[2*i+2]=e[i+2],n[2*i+3]=e[i+3],n[2*i+4]=e[i+4],n[2*i+5]=e[i+5];return super.setPositions(n),this}setColors(e,t=3){const n=e.length-t,i=new Float32Array(2*n);if(t===3)for(let s=0;s<n;s+=t)i[2*s]=e[s],i[2*s+1]=e[s+1],i[2*s+2]=e[s+2],i[2*s+3]=e[s+3],i[2*s+4]=e[s+4],i[2*s+5]=e[s+5];else for(let s=0;s<n;s+=t)i[2*s]=e[s],i[2*s+1]=e[s+1],i[2*s+2]=e[s+2],i[2*s+3]=e[s+3],i[2*s+4]=e[s+4],i[2*s+5]=e[s+5],i[2*s+6]=e[s+6],i[2*s+7]=e[s+7];return super.setColors(i,t),this}fromLine(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class em extends gi{constructor(e){super({type:"LineMaterial",uniforms:Vu.clone(Vu.merge([be.common,be.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new fe(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${nx>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(t){this.uniforms.diffuse.value=t}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(t){this.uniforms.linewidth.value=t}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(t){!!t!="USE_DASH"in this.defines&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(t){this.uniforms.dashScale.value=t}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(t){this.uniforms.dashSize.value=t}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(t){this.uniforms.dashOffset.value=t}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(t){this.uniforms.gapSize.value=t}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(t){this.uniforms.opacity.value=t}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(t){this.uniforms.resolution.value.copy(t)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(t){!!t!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),t===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}const Od=new yt,Rv=new D,Pv=new D,_n=new yt,yn=new yt,Fi=new yt,Fd=new D,Bd=new et,xn=new Uy,Iv=new D,eu=new pn,tu=new mn,Bi=new yt;let ki,ws;function Lv(r,e,t){return Bi.set(0,0,-e,1).applyMatrix4(r.projectionMatrix),Bi.multiplyScalar(1/Bi.w),Bi.x=ws/t.width,Bi.y=ws/t.height,Bi.applyMatrix4(r.projectionMatrixInverse),Bi.multiplyScalar(1/Bi.w),Math.abs(Math.max(Bi.x,Bi.y))}function iR(r,e){const t=r.matrixWorld,n=r.geometry,i=n.attributes.instanceStart,s=n.attributes.instanceEnd,l=Math.min(n.instanceCount,i.count);for(let c=0,u=l;c<u;c++){xn.start.fromBufferAttribute(i,c),xn.end.fromBufferAttribute(s,c),xn.applyMatrix4(t);const h=new D,d=new D;ki.distanceSqToSegment(xn.start,xn.end,d,h),d.distanceTo(h)<ws*.5&&e.push({point:d,pointOnLine:h,distance:ki.origin.distanceTo(d),object:r,face:null,faceIndex:c,uv:null,[ix]:null})}}function rR(r,e,t){const n=e.projectionMatrix,s=r.material.resolution,l=r.matrixWorld,c=r.geometry,u=c.attributes.instanceStart,h=c.attributes.instanceEnd,d=Math.min(c.instanceCount,u.count),p=-e.near;ki.at(1,Fi),Fi.w=1,Fi.applyMatrix4(e.matrixWorldInverse),Fi.applyMatrix4(n),Fi.multiplyScalar(1/Fi.w),Fi.x*=s.x/2,Fi.y*=s.y/2,Fi.z=0,Fd.copy(Fi),Bd.multiplyMatrices(e.matrixWorldInverse,l);for(let m=0,g=d;m<g;m++){if(_n.fromBufferAttribute(u,m),yn.fromBufferAttribute(h,m),_n.w=1,yn.w=1,_n.applyMatrix4(Bd),yn.applyMatrix4(Bd),_n.z>p&&yn.z>p)continue;if(_n.z>p){const w=_n.z-yn.z,T=(_n.z-p)/w;_n.lerp(yn,T)}else if(yn.z>p){const w=yn.z-_n.z,T=(yn.z-p)/w;yn.lerp(_n,T)}_n.applyMatrix4(n),yn.applyMatrix4(n),_n.multiplyScalar(1/_n.w),yn.multiplyScalar(1/yn.w),_n.x*=s.x/2,_n.y*=s.y/2,yn.x*=s.x/2,yn.y*=s.y/2,xn.start.copy(_n),xn.start.z=0,xn.end.copy(yn),xn.end.z=0;const M=xn.closestPointToPointParameter(Fd,!0);xn.at(M,Iv);const x=T_.lerp(_n.z,yn.z,M),_=x>=-1&&x<=1,E=Fd.distanceTo(Iv)<ws*.5;if(_&&E){xn.start.fromBufferAttribute(u,m),xn.end.fromBufferAttribute(h,m),xn.start.applyMatrix4(l),xn.end.applyMatrix4(l);const w=new D,T=new D;ki.distanceSqToSegment(xn.start,xn.end,T,w),t.push({point:T,pointOnLine:w,distance:ki.origin.distanceTo(T),object:r,face:null,faceIndex:m,uv:null,[ix]:null})}}}class sx extends Qt{constructor(e=new $p,t=new em({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,i=new Float32Array(2*t.count);for(let l=0,c=0,u=t.count;l<u;l++,c+=2)Rv.fromBufferAttribute(t,l),Pv.fromBufferAttribute(n,l),i[c]=c===0?0:i[c-1],i[c+1]=i[c]+Rv.distanceTo(Pv);const s=new Yu(i,2,1);return e.setAttribute("instanceDistanceStart",new ni(s,1,0)),e.setAttribute("instanceDistanceEnd",new ni(s,1,1)),this}raycast(e,t){const n=this.material.worldUnits,i=e.camera;i===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const s=e.params.Line2!==void 0&&e.params.Line2.threshold||0;ki=e.ray;const l=this.matrixWorld,c=this.geometry,u=this.material;ws=u.linewidth+s,c.boundingSphere===null&&c.computeBoundingSphere(),tu.copy(c.boundingSphere).applyMatrix4(l);let h;if(n)h=ws*.5;else{const p=Math.max(i.near,tu.distanceToPoint(ki.origin));h=Lv(i,p,u.resolution)}if(tu.radius+=h,ki.intersectsSphere(tu)===!1)return;c.boundingBox===null&&c.computeBoundingBox(),eu.copy(c.boundingBox).applyMatrix4(l);let d;if(n)d=ws*.5;else{const p=Math.max(i.near,eu.distanceToPoint(ki.origin));d=Lv(i,p,u.resolution)}eu.expandByScalar(d),ki.intersectsBox(eu)!==!1&&(n?iR(this,t):rR(this,i,t))}onBeforeRender(e){const t=this.material.uniforms;t&&t.resolution&&(e.getViewport(Od),this.material.uniforms.resolution.value.set(Od.z,Od.w))}}class sR extends sx{constructor(e=new rx,t=new em({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type="Line2"}}const zd=Ee.forwardRef(function({points:e,color:t=16777215,vertexColors:n,linewidth:i,lineWidth:s,segments:l,dashed:c,...u},h){var d,p;const m=ga(_=>_.size),g=Ee.useMemo(()=>l?new sx:new sR,[l]),[y]=Ee.useState(()=>new em),M=(n==null||(d=n[0])==null?void 0:d.length)===4?4:3,x=Ee.useMemo(()=>{const _=l?new $p:new rx,E=e.map(w=>{const T=Array.isArray(w);return w instanceof D||w instanceof yt?[w.x,w.y,w.z]:w instanceof fe?[w.x,w.y,0]:T&&w.length===3?[w[0],w[1],w[2]]:T&&w.length===2?[w[0],w[1],0]:w});if(_.setPositions(E.flat()),n){t=16777215;const w=n.map(T=>T instanceof Ie?T.toArray():T);_.setColors(w.flat(),M)}return _},[e,l,n,M]);return Ee.useLayoutEffect(()=>{g.computeLineDistances()},[e,g]),Ee.useLayoutEffect(()=>{c?y.defines.USE_DASH="":delete y.defines.USE_DASH,y.needsUpdate=!0},[c,y]),Ee.useEffect(()=>()=>{x.dispose(),y.dispose()},[x]),Ee.createElement("primitive",Zu({object:g,ref:h},u),Ee.createElement("primitive",{object:x,attach:"geometry"}),Ee.createElement("primitive",Zu({object:y,attach:"material",color:t,vertexColors:!!n,resolution:[m.width,m.height],linewidth:(p=i??s)!==null&&p!==void 0?p:1,dashed:c,transparent:M===4},u)))}),fs={x:.06,y:.36},Dv={x:.2,y:.16},Uv={x:.08,y:.2},Nv={x:288,y:184},oR=[96,100,84],aR=2.8,lR=1.55;function kd(r){const e=parseInt(r.slice(1),16);return[(e>>16&255)/255,(e>>8&255)/255,(e&255)/255]}function cR(){const r=kd(Lg[50]),e=kd(Kx[500]),t=kd(Lg[200]),n=[new Ie().setRGB(t[0],t[1],t[2],Wn)];for(let i=0;i<=tS.length;i++){const s=nS(i);n.push(new Ie().setRGB(r[0]+(e[0]-r[0])*s,r[1]+(e[1]-r[1])*s,r[2]+(e[2]-r[2])*s,Wn))}return n}function uR(){const r=new Rs(cr.w*(1+2*Uv.x),cr.h*(1+2*Uv.y),Nv.x,Nv.y),e=r.getAttribute("position"),t=new Float32Array(e.count*3),n=cR();for(let i=0;i<e.count;i++){const s=e.getX(i)/cr.w+.5,l=.5-e.getY(i)/cr.h;e.setZ(i,Ov(s,l));const c=n[$x(eS(s,l))+1];t[i*3]=c.r,t[i*3+1]=c.g,t[i*3+2]=c.b}return r.setAttribute("color",new Nt(t,3)),r}function Hd(r){const e=[],t=([n,i])=>[(n-.5)*cr.w,(.5-i)*cr.h,Ov(n,i)+.25];for(const n of r){const i=n.closed?[...n.points,n.points[0]]:n.points;for(let s=1;s<i.length;s++)e.push(t(i[s-1]),t(i[s]))}return e}function hR({active:r,wrap:e,onLean:t,onReady:n,onFail:i}){const s=ga(x=>x.size),l=ga(x=>x.gl),c=ga(x=>x.invalidate),u=ga(x=>x.frameloop),h=Ee.useRef(null),d=Ee.useRef({...fs}),p=Ee.useRef({...fs}),m=Ee.useRef(!1),g=Ee.useRef(r);Ee.useEffect(()=>{g.current=r,r||(p.current={...fs})},[r]);const y=Ee.useMemo(()=>uR(),[]);Ee.useEffect(()=>()=>y.dispose(),[y]);const M=Ee.useMemo(()=>{const x=jx();return{fine:Hd(x.lines.filter(_=>_.level%20!==10)),index:Hd(x.lines.filter(_=>_.level%20===10)),coast:Hd(x.coast)}},[]);return Ee.useEffect(()=>{c()},[s,c,u]),Ee.useEffect(()=>{const x=e.current;if(!x)return;const _=w=>{if(!g.current||w.pointerType==="touch")return;const T=x.getBoundingClientRect(),O=(w.clientX-T.left)/T.width*2-1,P=(w.clientY-T.top)/T.height*2-1;p.current={x:fs.x+O*Dv.x,y:fs.y-P*Dv.y},c()},E=()=>{p.current={...fs},c()};return x.addEventListener("pointermove",_),x.addEventListener("pointerleave",E),()=>{x.removeEventListener("pointermove",_),x.removeEventListener("pointerleave",E)}},[e,c]),Ee.useEffect(()=>{const x=l.domElement;return x.addEventListener("webglcontextlost",i),()=>x.removeEventListener("webglcontextlost",i)},[l,i]),NC((x,_)=>{const E=d.current,w=p.current,T=1-Math.exp(-Math.min(_,.05)*9);Math.abs(w.x-E.x)+Math.abs(w.y-E.y)<.002?(E.x=w.x,E.y=w.y):(E.x+=(w.x-E.x)*T,E.y+=(w.y-E.y)*T,x.invalidate());const P=h.current;if(P){const L=x.size.width/cr.w;P.matrix.set(L,0,L*E.x,0,0,L,L*E.y,0,0,0,L,0,0,0,0,1),P.matrixWorldNeedsUpdate=!0}t({x:E.x,y:E.y}),m.current||(m.current=!0,window.setTimeout(n,0))}),Bt.jsxs(Bt.Fragment,{children:[Bt.jsx("ambientLight",{intensity:lR}),Bt.jsx("directionalLight",{position:oR,intensity:aR}),Bt.jsxs("group",{ref:h,matrixAutoUpdate:!1,children:[Bt.jsx("mesh",{geometry:y,children:Bt.jsx("meshLambertMaterial",{vertexColors:!0,flatShading:!0})}),Bt.jsx(zd,{segments:!0,points:M.fine,color:Of[500],lineWidth:.9,transparent:!0,opacity:.6,depthTest:!1}),Bt.jsx(zd,{segments:!0,points:M.index,color:Of[500],lineWidth:1.4,transparent:!0,opacity:.78,depthTest:!1}),Bt.jsx(zd,{segments:!0,points:M.coast,color:Of[500],lineWidth:1.5,depthTest:!1})]})]})}function fR({sinkRef:r}){const[e,t]=Ee.useState(fs);return Ee.useEffect(()=>(r.current=n=>t(i=>i.x===n.x&&i.y===n.y?i:n),()=>{r.current=()=>{}}),[r]),Bt.jsx("svg",{viewBox:`0 0 ${cr.w} ${cr.h}`,className:"relief-ink",children:Bt.jsx(Qx,{lean:e})})}const dR=[1,1.5],pR={antialias:!0,powerPreference:"high-performance"},mR={position:[0,0,200],near:1,far:400},gR={scroll:!1};function wR({active:r,onReady:e,onFail:t}){const n=Ee.useRef(null),i=Ee.useRef(()=>{}),[s,l]=Ee.useState(!1),c=Ee.useCallback(h=>i.current(h),[]),u=()=>{l(!0),e()};return Bt.jsxs("div",{ref:n,className:"relief-live",children:[Bt.jsx(nR,{orthographic:!0,flat:!0,frameloop:r||!s?"demand":"never",dpr:dR,gl:pR,camera:mR,resize:gR,children:Bt.jsx(hR,{active:r,wrap:n,onLean:c,onReady:u,onFail:t})}),Bt.jsx(fR,{sinkRef:i})]})}export{wR as default};
