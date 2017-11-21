/**
 * MyGraphNode class, representing an intermediate node in the scene graph.
 * @constructor
**/

function MyGraphNode(graph, nodeID)
{
  this.graph = graph;

  this.nodeID = nodeID;

  // IDs of child nodes.
  this.children = [];

  // IDs of child nodes.
  this.leaves = [];

  // The material ID.
  this.materialID = null;

  // The texture ID.
  this.textureID = null;

  // The animation ID.
  this.animations = [];

  // This matrix will contain the current transformation matrix
  this.aniMatrix = mat4.create();

  // The node Matrix creation
  this.transformMatrix = mat4.create();

  // Seting the initial matrix to the identity matrix
  mat4.identity(this.transformMatrix);
}

/**
 * Adds the reference (ID) of another node to this node's children array.
 */
MyGraphNode.prototype.addChild = function(nodeID)
{
  this.children.push(nodeID);
};

/**
 * Adds a leaf to this node's leaves array.
 */
MyGraphNode.prototype.addLeaf = function(leaf)
{
  this.leaves.push(leaf);
};

/**
 * Prints the node leaves.
 */
MyGraphNode.prototype.showLeaves = function()
{
  console.log(this.leaves);
};

/**
 * Prints the node Children.
 */
MyGraphNode.prototype.showChildren = function()
{
  console.log(this.children);
};

/**
 * Adds an animations
 */
MyGraphNode.prototype.addAnimation = function(animation)
{
  this.animations.push(animation);
};

/**
 * Adds an animations
 */
MyGraphNode.prototype.resetAnimationRotation = function()
{
  this.aniMatrix[0] = 1;

  this.aniMatrix[2] = 0;

  this.aniMatrix[8] = 0;

  this.aniMatrix[10] = 1;
};

/**
 * Sets the value of materialID
 */
MyGraphNode.prototype.setMaterialID = function(materialID)
{
  this.materialID = materialID;
};

/**
 * Sets the value of textureID
 */
MyGraphNode.prototype.setTextureID = function(textureID)
{
  this.textureID = textureID;
};

/**
 * Returns the material ID of the node.
 */
MyGraphNode.prototype.getMaterialID = function ()
{
  return this.materialID;
};

/**
 * Returns the texture ID of the node.
 */
MyGraphNode.prototype.getTextureID = function ()
{
  return this.textureID;
};

/**
 * Returns the Animation ID of the node.
 */
MyGraphNode.prototype.getAnimations = function ()
{
  if(this.animations.length == 0)
    return null;
  else
    return this.animations;
};

/**
 * Returns the leaves of the node.
 */
MyGraphNode.prototype.getLeaves = function()
{
  return this.leaves;
};

/**
 * Returns the children of the node.
 */
MyGraphNode.prototype.getChildren = function ()
{
  return this.children;
};

/**
 * Analyses a node. It's a recursive funtion.
 */
MyGraphNode.prototype.analyse = function (scene, Tmatrix, Text, Mat, Time)
{
  //Get the node children
  var nodeChildren = this.getChildren();

  //Get the node Leafs
  var nodeLeafs = this.getLeaves();

  //Create a new Matrix
  var newMatrix = mat4.create();

  //If this node doesn t has a texture it inherits the fathers node texture
  if(this.getTextureID() == 'null')
  {
    if(Text != null)
      var newText = Text;
    else
      var newText = this.getTextureID();
  }
  else
    var newText = this.getTextureID();

  //If this node doesn t has a material it inherits the fathers node material
  if(this.getMaterialID() == 'null')
  {
    if (Mat != null)
      var newMat = Mat;
    else
      var newMat = this.getMaterialID();
  }
  else
    var newMat = this.getMaterialID();

  //If this node doesn t has a animation it inherits the fathers node animation
  if(this.getAnimations() != null)
  {
    var animations = this.getAnimations();

    var trans = mat4.create();

    trans = animations[0].correctMatrix(Time, scene.elapsedTime);

    mat4.multiply(this.aniMatrix, this.aniMatrix, trans);
  }

  //first applies the animation matrix
  mat4.multiply(newMatrix, Tmatrix, this.aniMatrix);

  this.resetAnimationRotation();

  //Set the newMatrix to be the multiplication of the parent node matrix and this node matrix
  mat4.multiply(newMatrix, newMatrix, this.transformMatrix);

  //Analyses all the node children, calling this function
  for (var i = 0; i < nodeChildren.length; i++)
    this.graph.nodes[nodeChildren[i]].analyse(scene, newMatrix, newText, newMat, Time);

  //Displays all the node Leafs
  for (var i = 0; i < nodeLeafs.length; i++)
  {
    //gets the obect to draw
    var toDraw = nodeLeafs[i].getLeaf(scene);

    //draws it
    nodeLeafs[i].draw(scene, toDraw, newMatrix, newText, newMat, Time);
  }
};