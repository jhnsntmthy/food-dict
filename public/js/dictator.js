/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*************************!*\
  !*** ./src/dictator.js ***!
  \*************************/
/***/ function(module, exports) {

	'use strict';
	
	var start = function start() {
	  var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
	  var func = args.shift();
	  try {
	    console.log(['started ->', func.name, args]);
	    func(args);
	  } catch (exception) {
	    console.error(["Some Exception", exception]);
	  }
	};
	var mobileDetection = function mobileDetection() {
	  var md = new MobileDetect(window.navigator.userAgent);
	  if (md.mobile() === null) {
	    $('.only-ios').hide();
	    $('.only-android').hide();
	  }
	
	  if (md.os() === "AndroidOS") {
	    $('.only-ios').hide();
	  }
	
	  if (md.os() === "iOS") {
	    $('.only-android').hide();
	  }
	  return true;
	};
	var phoneNumberForm = function phoneNumberForm() {
	  var DB = new Firebase('https://food-dictator.firebaseio.com/');
	  var currentTeam = '';
	  var currentUser = undefined;
	  var electionInterval = undefined;
	
	  var setup = function setup() {
	    $("#phone-number").mask("(999) 999-9999", { placeholder: " " });
	    $('#phone-number').on('keyup', _.debounce(watchPhoneNumberInput, 500));
	    $('#phone-number').val("");
	    $("#personal-div").hide();
	    $("#loading-indicator").hide();
	    makeElectionsUnavailable();
	  };
	  var keyIsNumber = function keyIsNumber(code) {
	    var bool = false;
	    if (code >= 48 && code <= 57) {
	      bool = true; // desktop keys for numbers
	    }
	    if (code == 229) {
	      bool = true; // Android numberpad
	    }
	    return bool;
	  };
	  var watchPhoneNumberInput = function watchPhoneNumberInput(evt) {
	    var num = $(evt.target).val().replace(/\D/g, '');
	    if (num.length === 10 && keyIsNumber(evt.keyCode)) {
	      lookupPhoneNumber(num);
	    }
	    if (num.length < 10) {
	      resetPersonalForm();
	    }
	  };
	  var resetPersonalForm = function resetPersonalForm() {
	    $("#personal-div").hide();
	    $("#election-btn-row").hide();
	    $("#personal-div input[type=text]").val('');
	    $("#phone-div").removeClass("col-lg-push-2");
	    $("#phone-div").addClass("col-lg-push-4 col-md-push-3");
	  };
	  var showPersonalForm = function showPersonalForm(snap) {
	    $("#loading-indicator").hide();
	    $("#personal-div").show();
	    scrollTo('#personal-div');
	    $("#phone-div").addClass("col-lg-push-2");
	    $("#phone-div").removeClass("col-lg-push-4 col-md-push-3");
	    var data = snap.val();
	    if (data !== null) {
	      $("#username").val(data.name);
	      $(".username-help.new").hide();
	      if (data.team !== "alone" && data.team.trim() !== '') {
	        $("#teamname").val(data.team);
	
	        $(".teamname-help.new").hide();
	        makeElectionsAvailable(data.team);
	      }
	    } else {
	      $(".help.existing").hide();
	      $("#personal-div #username").focus();
	    }
	    watchForPersonalChanges();
	  };
	  var lookupPhoneNumber = function lookupPhoneNumber(num) {
	    $("#loading-indicator").show();
	    scrollTo('#loading-indicator');
	    var userRef = DB.child('/users/1' + num);
	    userRef.once('value', function (snap) {
	      currentUser = num;
	      if (snap.val() !== null) {
	        showPersonalForm(snap);
	        currentTeam = snap.val().team;
	      }
	    });
	  };
	  var watchForPersonalChanges = function watchForPersonalChanges() {
	    $("#personal-div #teamname").focus(function () {
	      makeElectionsUnavailable();
	    });
	    $("#personal-div form input").on('keyup', _.debounce(updatePersonalData, 1500));
	  };
	  var updatePersonalData = function updatePersonalData() {
	    makeElectionsUnavailable();
	    currentTeam = $("#teamname").val().trim().toLowerCase();
	    DB.child("/users/1" + currentUser + '/name').set($("#username").val().trim());
	    if (currentTeam.length >= 3) {
	      DB.child("/users/1" + currentUser + '/team').set(currentTeam);
	      DB.child("/users/1" + currentUser + '/state').set('member', function (error) {
	        if (!error) {
	          makeElectionsAvailable(currentTeam);
	        }
	      });
	    }
	  };
	  var makeElectionsAvailable = function makeElectionsAvailable(team) {
	    $(".teamname").text(team);
	    DB.child("/teams/" + team).once('value', function (snap) {
	      console.log(['makeElectionsAvailable', snap.val()]);
	      if (snap.val().state === 'awaiting') {
	        setUpElectionStart();
	      } else {
	        watchRunningElection();
	      }
	    });
	  };
	  var makeElectionsUnavailable = function makeElectionsUnavailable() {
	    $("#election-btn-row").hide();
	    $("#running").hide();
	  };
	  var setUpElectionStart = function setUpElectionStart() {
	    $("#running").hide();
	    $("#election-btn-row").show();
	    $("#election-btn-row .btn-primary").click(function (evt) {
	      evt.preventDefault();
	      DB.child("/teams/" + currentTeam + "/state").set("campaign");
	      DB.child("/users/1" + currentUser + '/state').set('running', function (error) {
	        if (!error) {
	          watchRunningElection(currentTeam);
	        }
	      });
	    });
	  };
	  var watchRunningElection = function watchRunningElection(team) {
	    $("#running").show();
	    $("#election-btn-row").hide();
	    // scrollTo('#running');
	    setupResetButton();
	    console.log(['watchRunningElection', team]);
	    electionInterval = setInterval(getElectionStatus, 1000);
	  };
	  var getElectionStatus = function getElectionStatus() {
	    DB.child('users').once('child_changed', function (snap) {
	      if (snap.val().team === currentTeam) {
	        buildElectionStatus(buildElectionObj(snap));
	      }
	    });
	  };
	  var buildElectionObj = function buildElectionObj(snap) {
	    var guys = {};
	    var addSnap = function addSnap(snap) {
	      guys[snap.key()] = snap.val();
	      return guys;
	    };
	    return addSnap(snap);
	  };
	  var buildElectionStatus = function buildElectionStatus(obj) {
	    var data = _.map(obj, function (o) {
	      var state = o.state;
	      var cssclass = 'normal';
	      if (o.state === 'dictator') {
	        state = '<strong>' + o.state + '</strong>';
	        cssclass = 'winner';
	      }
	      return "<h3 class='" + cssclass + "'><em>" + o.name + "</em> - " + o.state + "</h3>";
	    });
	    $("#running .dat-status").html(data);
	  };
	  var setupResetButton = function setupResetButton() {
	    $("#reset").click(function (evt) {
	      scrollTo('#phone-div');
	      evt.preventDefault();
	      clearInterval(electionInterval);
	      DB.child("/teams/" + currentTeam + "/state").set("awaiting");
	      setUpElectionStart();
	    });
	  };
	
	  setup();
	};
	var scrollTo = function scrollTo(id) {
	  $('html, body').stop().animate({
	    scrollTop: $(id).offset().top - 50
	  }, 300, 'easeInOutExpo');
	};
	
	$(document).ready(function () {
	  start(mobileDetection);
	  start(phoneNumberForm);
	});

/***/ }
/******/ ]);
//# sourceMappingURL=dictator.js.map