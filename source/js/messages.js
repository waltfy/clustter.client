function ClustterMessage (message) {
  this.text = message;
  this.icon = '';
  this.className = '';
  this.setIcon = function (icon) { this.icon = 'fa-' + icon };
};

var ClustterError = function (message) {
  this.text = message;
  this.setIcon('warning');
  this.className = 'danger'; 
};

var ClustterWarning = function (message) {
  this.text = message;
  this.setIcon('warning');
  this.className = 'warning';
};

var ClustterInformation = function (message) {
  this.text = message;
  this.setIcon('info-circle');
  this.className = 'info';
};

var ClustterSuccess = function (message) {
  this.text = message;
  this.setIcon('check');
  this.className = 'success';
};

// Inheritance
ClustterError.prototype = new ClustterMessage;
ClustterWarning.prototype = new ClustterMessage;
ClustterInformation.prototype = new ClustterMessage;
ClustterSuccess.prototype = new ClustterMessage;