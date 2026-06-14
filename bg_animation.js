// WebGL2 Animated Background
(function() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const gl = canvas.getContext('webgl2', { alpha: false });
  if (!gl) return;

  const colors = [
    [0.0,0.05,0.15],[0.0,0.08,0.2],[0.0,0.12,0.25],[0.0,0.15,0.3],
    [0.05,0.2,0.35],[0.08,0.25,0.42],[0.1,0.3,0.5],[0.12,0.35,0.55],
    [0.15,0.4,0.6],[0.18,0.45,0.65],[0.2,0.5,0.7],[0.25,0.55,0.75],
    [0.3,0.6,0.8],[0.35,0.65,0.82],[0.4,0.7,0.85],[0.45,0.75,0.88],
    [0.5,0.8,0.9],[0.6,0.85,0.92],[0.7,0.9,0.95],[0.8,0.95,0.98]
  ];
  const colorSrc = colors.map(c => `vec3(${c[0]},${c[1]},${c[2]})`).join(',\n  ');

  const fs = `#version 300 es
precision highp float;
out vec4 o;
uniform vec2 uR;
uniform float uT;
#define N 20
vec3 sc[N]=vec3[](${colorSrc});
vec3 pm(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);}
float n2(vec2 v){
  const vec4 C=vec4(0.211324865,0.366025403,-0.577350269,0.024390243);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz;
  x12.xy-=i1;
  i=mod(i,289.0);
  vec3 p=pm(pm(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5);
  vec3 a0=x-ox;
  m*=1.792843-0.853734*(a0*a0+h*h);
  vec3 g;
  g.x=a0.x*x0.x+h.x*x0.y;
  g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}
float fbm(vec2 st){
  float v=0.0,a=0.5,f=1.0;
  for(int i=0;i<10;i++){v+=a*n2(st*f);f*=2.0;a*=0.5;}
  return v;
}
void main(){
  vec2 uv=(gl_FragCoord.xy/uR)*2.0-1.0;
  uv.x*=uR.x/uR.y;
  uv*=0.3;
  float t=uT*0.25;
  float wa=0.2+0.15*n2(vec2(t,27.7));
  uv.x+=wa*sin(uv.y*4.0+t);
  uv.y+=wa*sin(uv.x*4.0-t);
  float r=length(uv);
  float angle=atan(uv.y,uv.x);
  float sw=1.2*(1.0-smoothstep(0.0,1.0,r));
  angle+=sw*sin(uT+r*5.0);
  uv=vec2(cos(angle),sin(angle))*r;
  float nv=fbm(uv);
  nv+=0.2*sin(t+nv*3.0);
  float nrm=0.5*(nv+1.0);
  float idx=clamp(nrm,0.0,1.0)*19.0;
  int lo=int(floor(idx));
  int hi=int(min(floor(idx)+1.0,19.0));
  float f=fract(idx);
  vec3 col=mix(sc[lo],sc[hi],f);
  o=vec4(col,1.0);
}`;

  const vs = `#version 300 es
precision mediump float;
in vec2 aP;
void main(){gl_Position=vec4(aP,0.0,1.0);}`;

  function mkSh(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, mkSh(gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, mkSh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
  const vbo = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
  const aP = gl.getAttribLocation(prog, 'aP');
  gl.enableVertexAttribArray(aP);
  gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 0, 0);

  const uR = gl.getUniformLocation(prog, 'uR');
  const uT = gl.getUniformLocation(prog, 'uT');
  const t0 = performance.now();

  (function render() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uR, canvas.width, canvas.height);
    gl.uniform1f(uT, (performance.now() - t0) * 0.001);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  })();
})();