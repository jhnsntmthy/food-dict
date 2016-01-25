let start = function() {
  let args = (arguments.length === 1?[arguments[0]]:Array.apply(null, arguments));
  let func = args.shift();
  try {
    console.log(['started ->', func.name, args]);
    func(args);
  }
  catch(exception) {
    console.error(["Some Exception", exception]);
  }
}
let mobileDetection = function() {
  let md = new MobileDetect(window.navigator.userAgent);
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
let phoneNumberForm = function() {
  const DB = new Firebase('https://food-dictator.firebaseio.com/');
  let currentTeam = '';
  let currentUser;
  let electionInterval;

  let setup = function() {
    $("#phone-number").mask("(999) 999-9999",{placeholder:" "});
    $('#phone-number').on('keyup', _.debounce(watchPhoneNumberInput, 500));
    $('#phone-number').val("");
    $("#personal-div").hide();
    $("#loading-indicator").hide();
    makeElectionsUnavailable();
  };
  let keyIsNumber = function(code) {
    let bool = false;
    if (code >= 48 && code <= 57) {
      bool = true; // desktop keys for numbers
    }
    if (code == 229) {
      bool = true; // Android numberpad
    }
    return bool;
  };
  let watchPhoneNumberInput = function(evt) {
    let num = $(evt.target).val().replace(/\D/g,'');
    if (num.length === 10 && keyIsNumber(evt.keyCode)) {
      lookupPhoneNumber(num);
    }
    if (num.length < 10) {
      resetPersonalForm();
    }
  };
  let resetPersonalForm = function() {
    $("#personal-div").hide();
    $("#election-btn-row").hide();
    $("#personal-div input[type=text]").val('');
    $("#phone-div").removeClass("col-lg-push-2");
    $("#phone-div").addClass("col-lg-push-4 col-md-push-3");
  }
  let showPersonalForm = function(snap) {
    $("#loading-indicator").hide();
    $("#personal-div").show();
    scrollTo('#personal-div');
    $("#phone-div").addClass("col-lg-push-2");
    $("#phone-div").removeClass("col-lg-push-4 col-md-push-3");
    let data = snap.val();
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
  let lookupPhoneNumber = function(num) {
    $("#loading-indicator").show();
    scrollTo('#loading-indicator');
    let userRef = DB.child('/users/1'+num);
    userRef.once('value', function(snap) {
      currentUser = num;
      if (snap.val() !== null) {
        showPersonalForm(snap);
        currentTeam = snap.val().team;
      }
    });
  };
  let watchForPersonalChanges = function() {
    $("#personal-div #teamname").focus(function() {
      makeElectionsUnavailable();
    });
    $("#personal-div form input").on('keyup', _.debounce(updatePersonalData, 1500));
  }
  let updatePersonalData = function() {
    makeElectionsUnavailable();
    currentTeam = $("#teamname").val().trim().toLowerCase();
    DB.child("/users/1"+currentUser+'/name').set($("#username").val().trim());
    if (currentTeam.length >= 3) {
      DB.child("/users/1"+currentUser+'/team').set(currentTeam);
      DB.child("/users/1"+currentUser+'/state').set('member', function(error) {
        if (!error) {
          makeElectionsAvailable(currentTeam);
        }
      });
    }
  };
  let makeElectionsAvailable = function(team) {
    $(".teamname").text(team);
    DB.child("/teams/"+team).once('value', function(snap) {
      console.log(['makeElectionsAvailable',snap.val()]);
      if (snap.val().state === 'awaiting') {
        setUpElectionStart();
      } else {
        watchRunningElection();
      }
    });
  };
  let makeElectionsUnavailable = function() {
    $("#election-btn-row").hide();
    $("#running").hide();
  };
  let setUpElectionStart = function() {
    $("#running").hide();
    $("#election-btn-row").show();
    $("#election-btn-row .btn-primary").click(function(evt) {
      evt.preventDefault();
      DB.child("/teams/"+currentTeam+"/state").set("campaign");
      DB.child("/users/1"+currentUser+'/state').set('running', function(error) {
        if (!error) {
          watchRunningElection(currentTeam);
        }
      });
    });
  };
  let watchRunningElection = function(team) {
    $("#running").show();
    $("#election-btn-row").hide();
    // scrollTo('#running');
    setupResetButton();
    console.log(['watchRunningElection', team]);
    electionInterval = setInterval(getElectionStatus, 1000);
  };
  let getElectionStatus = function() {
    DB.child('users').once('child_changed', function(snap) {
      if (snap.val().team === currentTeam) {
        buildElectionStatus(buildElectionObj(snap));
      }
    });
  };
  let buildElectionObj = function(snap) {
    let guys = {};
    let addSnap = function(snap) {
      guys[snap.key()] = snap.val();
      return guys;
    }
    return addSnap(snap);
  };
  let buildElectionStatus = function(obj) {
    var data = _.map(obj, function(o) {
      let state = o.state;
      let cssclass = 'normal';
      if (o.state === 'dictator') {
        state = '<strong>'+o.state+'</strong>';
        cssclass = 'winner';
      }
      return "<h3 class='" + cssclass +"'><em>"+o.name+"</em> - "
        + o.state +"</h3>";
    });
    $("#running .dat-status").html(data);
  }
  let setupResetButton = function() {
    $("#reset").click(function(evt) {
      scrollTo('#phone-div');
      evt.preventDefault();
      clearInterval(electionInterval);
      DB.child("/teams/"+currentTeam+"/state").set("awaiting");
      setUpElectionStart();
    });
  };

  setup();
}
let scrollTo = function(id) {
  $('html, body').stop().animate({
      scrollTop: ($(id).offset().top - 50)
  }, 300, 'easeInOutExpo');
}



$(document).ready(function() {
  start(mobileDetection);
  start(phoneNumberForm);
});

