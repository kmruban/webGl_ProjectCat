/////////////////////////
//   MODEL AFTER 4D    //
/////////////////////////
"use strict";

var canvas, gl, program;

var projectionMatrix, modelViewMatrix, instanceMatrix, instanceMatrix;
var modelViewMatrixLoc, normalMatrix, normalMatrixLoc;
var ambientProduct, diffuseProduct, specularProduct;
var specularProductLoc, diffuseProductLoc, ambientProductLoc, lightPositionLoc, shininessLoc;
var vBuffer, nBuffer;
var pointsArray = [];
var normalsArray = [];

var cat1_walk = false;
var cat1_gotomax = true;
var cat1_gotomin = false;
var cat1_walk_back = false;
var cat1_f_gotomid = true;
var cat1_f_gotoedge = false;


var cat1_jump = false;
var cat1_jump_top = false;
var cat1_jump_bottom = true;
var cat1_legs = true;
var cat1_j = 0;
var cat1_f = -7.25;

var cat1_wagtail = false;
var cat1_wagtail_max = false;
var cat1_wagtail_min = true;

var cat2_walk = false;
var cat2_walk_back = false;
var cat2_gotomax = true;
var cat2_gotomin = false;
var cat2_f_gotomid = true;
var cat2_f_gotoedge = false;

var cat2_wagtail = false;
var cat2_wagtail_max = false;
var cat2_wagtail_min = true;

var cat2_jump = false;
var cat2_jump_top = false;
var cat2_jump_bottom = true;
var cat2_j = 0;
var cat2_f = 7.25;

var reset = false;

var vertices = [

    vec4( -2.0, -0.18,  0.7, 1.0 ),
    vec4( -2.0,  0.18,  0.7, 1.0 ),
    vec4( 2.0,  0.18,  0.7, 1.0 ),
    vec4( 2.0, -0.18,  0.7, 1.0 ),
    vec4( -2.0, -0.18, -0.7, 1.0 ),
    vec4( -2.0,  0.18, -0.7, 1.0 ),
    vec4( 2.0,  0.18, -0.7, 1.0 ),
    vec4( 2.0, -0.18, -0.7, 1.0 )

   /* 
vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
    
    */
];

var lightPosition = vec4(0.0, 0.0, 1.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialShininess = 100.0;

var torsoId = 0;
var head1Id = 1;
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;
var tailId = 10;

var torsoId2 = 0;
var head1Id2 = 1;
var leftUpperArmId2 = 2;
var leftLowerArmId2 = 3;
var rightUpperArmId2 = 4;
var rightLowerArmId2 = 5;
var leftUpperLegId2 = 6;
var leftLowerLegId2 = 7;
var rightUpperLegId2 = 8;
var rightLowerLegId2 = 9;
var tailId2 = 10;


var torsoHeight = 4.0;
var torsoWidth = 1;
var upperArmHeight = 3;
var lowerArmHeight = 2.75;
var upperArmWidth  = 0.2;
var lowerArmWidth  = 0.16;
var upperLegWidth  = 0.2;
var lowerLegWidth  = 0.16;
var lowerLegHeight = 2.75;
var upperLegHeight = 3;
var headHeight = 2.75;
var headWidth = 0.5;
var tailHeight = 7;
var tailWidth = 0.1;

var numNodes = 11;
var numAngles = 11;
//-55
var theta = [-45, 10, 0, 0, 0, 0, 170, 20, 170, 20, 0, 0, 0];
var theta2 = [-135, 10, 0, 0, 0, 0, 170, 20, 170, 20, 0, 0, 0];

var stack = [];
var figure = [];
var stack2 = [];
var figure2 = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);
for( var i=0; i<numNodes; i++) figure2[i] = createNode2(null, null, null, null);
//-------------------------------------------

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//--------------------------------------------

function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}


function createNode2(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}

function initNodes(Id) {

    var m = mat4();

    switch(Id) {

    case torsoId:
    	m = mult(m, translate(cat1_f, cat1_j, 0.0));
		m = mult(m, rotate(theta[torsoId], 0, 1, 0 ));
		figure[torsoId] = createNode( m, torso, null, head1Id );
    break;
    case head1Id:
    	m = mult(m, translate(1.675, 1.24, 0.0));
		m = mult(m, rotate(theta[head1Id], 0, 0, 1))
		figure[head1Id] = createNode( m, head, leftUpperArmId, null);
    break;
    case leftUpperArmId:
    	m = translate(1.25, -1, -0.4);
    	m = mult(m, translate(0, 0.5, 0));
		m = mult(m, rotate(theta[leftUpperArmId], 0, 0, 1));
		figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftLowerArmId );
    break;
    case rightUpperArmId:
    	m = translate(1.25, -1, 0.4);
    	m = mult(m, translate(0, 0.5, 0));
		m = mult(m, rotate(theta[rightUpperArmId], 0, 0, 1));
		figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightLowerArmId );
    break;
    case leftUpperLegId:
    	m = translate(-1.25, -1, -0.4);
    	m = mult(m, translate(0, 0.5, 0));
		m = mult(m , rotate(theta[leftUpperLegId], 0, 0, 1));
		figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
    break;
    case rightUpperLegId:
		m = translate(-1.25, -1, 0.4);
		m = mult(m, translate(0, 0.5, 0));
		m = mult(m, rotate(theta[rightUpperLegId], 0, 0, 1));
		figure[rightUpperLegId] = createNode( m, rightUpperLeg, tailId, rightLowerLegId );
    break;
    case leftLowerArmId:
		m = translate(0.02, -1, 0.0);
		m = mult(m, rotate(theta[leftLowerArmId], 0, 0, 1));
		figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
    break;
    case rightLowerArmId:
		m = translate(0.02, -1, 0.0);
		m = mult(m, rotate(theta[rightLowerArmId], 0, 0, 1));
		figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
    break;
    case leftLowerLegId:
		m = translate(-0.17, 1, 0.0);
		m = mult(m, rotate(theta[leftLowerLegId], 0, 0, 1));
		figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );
    break;
    case rightLowerLegId:
		m = translate(-0.17, 1, 0.0);
		m = mult(m, rotate(theta[rightLowerLegId], 0, 0, 1));
		figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
    break;
    case tailId:
    	m = translate(-1.25, 1.5, 0.0);
    	m = mult(m, translate(0, -0.825, 0));
    	m = mult(m, rotate(theta[tailId], 1, 0, 0));
    	figure[tailId] = createNode( m, tail, null ,null);
    break;
    
    }
}

function initNodes2(Id) {

    var m = mat4();

    switch(Id) {

    case torsoId2:
    	m = mult(m, translate(cat2_f, cat2_j, 0.0));
		m = mult(m, rotate(theta2[torsoId2], 0, 1, 0 ));
		figure2[torsoId2] = createNode2( m, torso2, null, head1Id2 );
    break;
    case head1Id2:
    	m = mult(m, translate(1.675, 1.24, 0.0));
		m = mult(m, rotate(theta2[head1Id2], 0, 0, 1))
		figure2[head1Id2] = createNode2( m, head2, leftUpperArmId2, null);
    break;
    case leftUpperArmId2:
    	m = translate(1.25, -1, -0.4);
    	m = mult(m, translate(0, 0.5, 0));
		m = mult(m, rotate(theta2[leftUpperArmId2], 0, 0, 1));
		figure2[leftUpperArmId2] = createNode2( m, leftUpperArm2, rightUpperArmId2, leftLowerArmId2 );
    break;
    case rightUpperArmId2:
    	m = translate(1.25, -1, 0.4);
    	m = mult(m, translate(0, 0.5, 0));
		m = mult(m, rotate(theta2[rightUpperArmId2], 0, 0, 1));
		figure2[rightUpperArmId2] = createNode2( m, rightUpperArm2, leftUpperLegId2, rightLowerArmId2 );
    break;
    case leftUpperLegId2:
    	m = translate(-1.25, -1, -0.4);
    	m = mult(m, translate(0, 0.5, 0));
		m = mult(m, rotate(theta2[leftUpperLegId2], 0, 0, 1));
		figure2[leftUpperLegId2] = createNode2( m, leftUpperLeg2, rightUpperLegId2, leftLowerLegId2 );
    break;
    case rightUpperLegId2:
		m = translate(-1.25, -1, 0.4);
		m = mult(m, translate(0, 0.5, 0));
		m = mult(m, rotate(theta2[rightUpperLegId2], 0, 0, 1));
		figure2[rightUpperLegId2] = createNode2( m, rightUpperLeg2, tailId2, rightLowerLegId2 );
    break;
    case leftLowerArmId2:
		m = translate(0.02, -1, 0.0);
		m = mult(m, rotate(theta2[leftLowerArmId2], 0, 0, 1));
		figure2[leftLowerArmId2] = createNode2( m, leftLowerArm2, null, null );
    break;
    case rightLowerArmId2:
		m = translate(0.02, -1, 0.0);
		m = mult(m, rotate(theta2[rightLowerArmId2], 0, 0, 1));
		figure2[rightLowerArmId2] = createNode2( m, rightLowerArm2, null, null );
    break;
    case leftLowerLegId2:
		m = translate(-0.17, 1, 0.0);
		m = mult(m, rotate(theta2[leftLowerLegId2], 0, 0, 1));
		figure2[leftLowerLegId2] = createNode2( m, leftLowerLeg2, null, null );
    break;
    case rightLowerLegId2:
		m = translate(-0.17, 1, 0.0);
		m = mult(m, rotate(theta2[rightLowerLegId2], 0, 0, 1));
		figure2[rightLowerLegId2] = createNode2( m, rightLowerLeg2, null, null );
    break;
    case tailId2:
    	m = translate(-1.25, 1.5, 0.0);
    	m = mult(m, translate(0, -0.825, 0));
    	m = mult(m, rotate(theta2[tailId2], 1, 0, 0));
    	figure2[tailId2] = createNode2( m, tail2, null ,null);
    break;
    
    }
}

function traverse(Id) {
   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}
function traverse2(Id) {
   if(Id == null) return;
   stack2.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure2[Id].transform);
   figure2[Id].render();
   if(figure2[Id].child != null) traverse2(figure2[Id].child);
    modelViewMatrix = stack2.pop();
   if(figure2[Id].sibling != null) traverse2(figure2[Id].sibling);
}

// FIRST CAT
function torso() {
    instanceMatrix = mult(modelViewMatrix, translate(0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( .8, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    
}

function tail() {
    instanceMatrix = mult(modelViewMatrix, translate(0, 0.825, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( 0.05, tailHeight, tailWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {
    instanceMatrix = mult(modelViewMatrix, translate(0, 0, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(.2, headHeight, .4) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArm() {
    instanceMatrix = mult(modelViewMatrix, translate(0, -0.5, 0));
	instanceMatrix = mult(instanceMatrix, scale4(.1, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArm() {
    instanceMatrix = mult(modelViewMatrix, translate(0, -0.5, 0) );
	instanceMatrix = mult(instanceMatrix, scale4(.08, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArm() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, -0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(.1, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArm() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, -0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(.08, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(.1, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLeg() {
    instanceMatrix = mult(modelViewMatrix, translate( 0.1, 0.47, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(.08, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(.1, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.1, 0.47, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(.08, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

// SECOND CAT
function torso2() {
    instanceMatrix = mult(modelViewMatrix, translate(0, 0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( .8, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    
}

function tail2() {
    instanceMatrix = mult(modelViewMatrix, translate(0, 0.825, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( 0.05, tailHeight, tailWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head2() {
    instanceMatrix = mult(modelViewMatrix, translate(0, 0, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(.2, headHeight, .4) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArm2() {
    instanceMatrix = mult(modelViewMatrix, translate(0, -0.5, 0));
	instanceMatrix = mult(instanceMatrix, scale4(.1, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArm2() {
    instanceMatrix = mult(modelViewMatrix, translate(0, -0.5, 0) );
	instanceMatrix = mult(instanceMatrix, scale4(.08, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArm2() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, -0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(.1, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArm2() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, -0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(.08, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLeg2() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(.1, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLeg2() {
    instanceMatrix = mult(modelViewMatrix, translate( 0.1, 0.47, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(.08, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLeg2() {
    instanceMatrix = mult(modelViewMatrix, translate(0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(.1, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLeg2() {
    instanceMatrix = mult(modelViewMatrix, translate(0.1, 0.47, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(.08, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}


function quad(a, b, c, d) {
     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);
     
    
     pointsArray.push(vertices[a]);
          normalsArray.push(normal);
     pointsArray.push(vertices[b]);
          normalsArray.push(normal);
     pointsArray.push(vertices[c]);
          normalsArray.push(normal);
     pointsArray.push(vertices[d]);
          normalsArray.push(normal);
}

function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
    gl.enable( gl.DEPTH_TEST );

    //
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program);

    instanceMatrix = mat4();

    projectionMatrix = ortho(-10.0,10.0,-10.0, 10.0,-10.0,10.0);
    modelViewMatrix = mat4();

    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv(gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")

	ambientProductLoc = gl.getUniformLocation(program,"ambientProduct");
	diffuseProductLoc = gl.getUniformLocation(program,"diffuseProduct");
	specularProductLoc = gl.getUniformLocation(program,"specularProduct");
	lightPositionLoc = gl.getUniformLocation(program,"lightPosition");
	shininessLoc = gl.getUniformLocation(program, "shininess");

    cube();

    //nBuffer
    nBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );
    
    //vBuffer
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    /////CAT 1
    document.getElementById("cat1_walk_forward").onclick = function() {
		cat1_walk = !cat1_walk;
		cat1_walk_back = false;

    };
    document.getElementById("cat1_walk_backward").onclick = function() {
		cat1_walk_back = !cat1_walk_back;
		cat1_walk = false;
		cat1_f_gotoedge = true;

    };
    document.getElementById("cat1_sway_tail").onclick = function() {
		cat1_wagtail = !cat1_wagtail;
    };
    document.getElementById("cat1_jump").onclick = function() {
		cat1_jump = !cat1_jump;
    };
	/////CAT 2
    document.getElementById("cat2_walk_forward").onclick = function() {
		cat2_walk = !cat2_walk;
		cat2_walk_back = false;
    };
    document.getElementById("cat2_walk_backward").onclick = function() {
		cat2_walk_back = !cat2_walk_back;
		cat2_walk = false;
		cat2_f_gotoedge = true;
    };
    document.getElementById("cat2_sway_tail").onclick = function() {
		cat2_wagtail = !cat2_wagtail;
    };
    document.getElementById("cat2_jump").onclick = function() {
		cat2_jump = !cat2_jump;
    };
    /////RESET
  	document.getElementById("reset").onclick = function() {
		reset = !reset;
    };

    for(i=0; i<numNodes; i++) {
    	initNodes(i);
    	initNodes2(i);
    }

    render();
}

var render = function() {

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
        
        ambientProduct = mult(lightAmbient, materialAmbient);
    	diffuseProduct = mult(lightDiffuse, materialDiffuse);
    	specularProduct = mult(lightSpecular, materialSpecular);
    	
    	gl.uniform4fv( ambientProductLoc, flatten(ambientProduct) );
    	gl.uniform4fv( diffuseProductLoc, flatten(diffuseProduct) );
    	gl.uniform4fv( specularProductLoc, flatten(specularProduct) );
    	gl.uniform4fv( lightPositionLoc, flatten(lightPosition) );
    	gl.uniform1f( shininessLoc, materialShininess );
        
        
//////// CAT 1 WALK //////////////
		if (cat1_walk == true && cat1_gotomax == true){
			cat1_walk_back = false;
			theta[leftUpperArmId] += 1.5;
			theta[rightUpperArmId] -= 1.5;
			theta[leftUpperLegId] += 1.5;
			theta[rightUpperLegId] -= 1.5;
			if(theta[leftUpperArmId] > 50){
				cat1_gotomax = false;
				cat1_gotomin = true;
			}
		}
		if (cat1_walk == true && cat1_gotomin == true){
			theta[leftUpperArmId] -= 1.5;
			theta[rightUpperArmId] += 1.5;
			theta[leftUpperLegId] -= 1.5;
			theta[rightUpperLegId] += 1.5;
			if(theta[leftUpperArmId] < -50){
				cat1_gotomax = true;
				cat1_gotomin = false;
			}
		}
		
		if(cat1_walk == true && cat1_f_gotomid == true){
			cat1_f += 0.1;
			if(cat1_f > -1.5){
				cat1_f_gotomid = false;
				cat1_f_gotoedge = true;
				cat1_walk = false;
			}
		}
//////// CAT 1 WALK BACK //////////////
		if(cat1_walk_back == true && cat1_f_gotoedge == true){
			cat1_walk = false;	
			cat1_f -= 0.1;
			theta[leftUpperArmId] -= 1.5;
			theta[rightUpperArmId] += 1.5;
			theta[leftUpperLegId] -= 1.5;
			theta[rightUpperLegId] += 1.5;
			if(cat1_f < -8.3){
				cat1_f_gotoedge = false;
				cat1_f_gotomid = true;
			}
		}
//////// CAT 1 JUMP //////////////
        if(cat1_jump == true && cat1_jump_top == false && cat1_jump_bottom == true){
        	cat1_j += 0.1;
        	if(cat1_j > 1.5){
        		cat1_jump_top = true;
        		cat1_jump_bottom = false;
        	}
        }
		if(cat1_jump == true && cat1_jump_top == true && cat1_jump_bottom == false){
        	cat1_j -= 0.1;
        	if(cat1_j < 0){
        		cat1_jump_top = false;
        		cat1_jump_bottom = true;
        	}
        }
        if(cat1_jump == false){
        	cat1_j = 0;
        }
                
//////// CAT 1 WAG TAIL //////////////
        if(cat1_wagtail == true && cat1_wagtail_max == false && cat1_wagtail_min == true){
        	theta[tailId] += 2.5;
        	if(theta[tailId] > 50){
        		cat1_wagtail_max = true;
        		cat1_wagtail_min = false;
        	}
        }
        if(cat1_wagtail == true && cat1_wagtail_max == true && cat1_wagtail_min == false){
        	theta[tailId] -= 1.4;
        	if(theta[tailId] < -50){
        		cat1_wagtail_max = false;
        		cat1_wagtail_min = true;
        	}
        }
        initNodes(tailId);
        initNodes(torsoId);
		initNodes(leftUpperArmId);
		initNodes(rightUpperArmId);
		initNodes(leftUpperLegId);
		initNodes(rightUpperLegId);
		
//////// CAT 2 WALK //////////////
		if (cat2_walk == true && cat2_gotomax == true){
			theta2[leftUpperArmId] += 1.5;
			theta2[rightUpperArmId] -= 1.5;
			theta2[leftUpperLegId] += 1.5;
			theta2[rightUpperLegId] -= 1.5;
			if(theta2[leftUpperArmId] > 50){
				cat2_gotomax = false;
				cat2_gotomin = true;
			}
		}
		if (cat2_walk == true && cat2_gotomin == true){
			theta2[leftUpperArmId] -= 1.5;
			theta2[rightUpperArmId] += 1.5;
			theta2[leftUpperLegId] -= 1.5;
			theta2[rightUpperLegId] += 1.5;
			if(theta2[leftUpperArmId] < -50){
				cat2_gotomax = true;
				cat2_gotomin = false;
			}
		}
		
		if(cat2_walk == true && cat2_f_gotomid == true){
			cat2_f -= 0.1;
			if(cat2_f < 2){
				cat2_f_gotomid = false;
				cat2_f_gotoedge = true;
				cat2_walk = false;
			}
		}	
//////// CAT 2 WALK BACK //////////////
		if(cat2_walk_back == true && cat2_f_gotoedge == true){
			cat2_walk = false;	
			cat2_f += 0.1;
			theta2[leftUpperArmId] -= 1.5;
			theta2[rightUpperArmId] += 1.5;
			theta2[leftUpperLegId] -= 1.5;
			theta2[rightUpperLegId] += 1.5;
			if(cat2_f > 8.3){
				cat2_f_gotoedge = false;
				cat2_f_gotomid = true;
			}
		}
//////// CAT 2 JUMP //////////////
        if(cat2_jump == true && cat2_jump_top == false && cat2_jump_bottom == true){
        	cat2_j += 0.1;
        	if(cat2_j > 1.5){
        		cat2_jump_top = true;
        		cat2_jump_bottom = false;
        	}
        }
		if(cat2_jump == true && cat2_jump_top == true && cat2_jump_bottom == false){
        	cat2_j -= 0.1;
        	if(cat2_j < 0){
        		cat2_jump_top = false;
        		cat2_jump_bottom = true;
        	}
        }
        if(cat2_jump == false){
        	cat2_j = 0;
        	cat2_gotomax = true;
        }
//////// CAT 2 WAG TAIL //////////////
        if(cat2_wagtail == true && cat2_wagtail_max == false && cat2_wagtail_min == true){
        	theta2[tailId2] += 2.5;
        	if(theta2[tailId2] > 50){
        		cat2_wagtail_max = true;
        		cat2_wagtail_min = false;
        	}
        }
        if(cat2_wagtail == true && cat2_wagtail_max == true && cat2_wagtail_min == false){
        	theta2[tailId2] -= 1.4;
        	if(theta2[tailId2] < -50){
        		cat2_wagtail_max = false;
        		cat2_wagtail_min = true;
        	}
        }
        initNodes2(torsoId2);
        initNodes2(tailId2);
        initNodes2(leftUpperArmId2);
		initNodes2(rightUpperArmId2);
		initNodes2(leftUpperLegId2);
		initNodes2(rightUpperLegId2);
        
        if(reset == true){
        	cat1_f = -7.25;
        	cat1_j = 0;
        	cat1_walk = false;
        	cat1_walk_back = false;
        	cat1_jump = false;
        	cat1_wagtail = false;
        	cat1_f_gotomid = true;
        	theta[leftUpperArmId] = 0;
			theta[rightUpperArmId] = 0;
			theta[leftUpperLegId] = 170;
			theta[rightUpperLegId] = 170;
			theta[tailId] = 0;
        	
        	cat2_f = 7.25;
        	cat2_j = 0;
        	cat2_walk = false;
        	cat2_walk_back = false;
        	cat2_jump = false;
        	cat2_wagtail = false;
        	cat2_f_gotomid = true;
        	theta2[leftUpperArmId] = 0;
			theta2[rightUpperArmId] = 0;
			theta2[leftUpperLegId] = 170;
			theta2[rightUpperLegId] = 170;
			theta2[tailId] = 0;
			reset = false;
        } else {
        	
        }
        initNodes(tailId);
        initNodes(torsoId);
		initNodes(leftUpperArmId);
		initNodes(rightUpperArmId);
		initNodes(leftUpperLegId);
		initNodes(rightUpperLegId);
        initNodes2(torsoId2);
        initNodes2(tailId2);
        initNodes2(leftUpperArmId2);
		initNodes2(rightUpperArmId2);
		initNodes2(leftUpperLegId2);
		initNodes2(rightUpperLegId2);
        
        traverse(torsoId);
        traverse2(torsoId2);
        
        
        
        requestAnimFrame(render);
}

