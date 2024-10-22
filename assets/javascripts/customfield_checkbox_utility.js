if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, "includes", {
    value: function (searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var o = Object(this);
      var len = o.length >>> 0;
      if (len === 0) {
        return false;
      }
      var n = fromIndex | 0;
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
      while (k < len) {
        if (o[k] === searchElement) {
          return true;
        }
        k++;
      }
      return false;
    },
  });
}

function cfcbShowAll(tagname) {
  var users = $('input[name="' + tagname + '"]');
  for (var i = 0, len = users.length - 1; i < len; i++) {
    users[i].parentElement.style.display = "block";
  }
}

function cfcbShowChecked(tagname) {
  var users = $('input[name="' + tagname + '"]');
  for (var i = 0, len = users.length - 1; i < len; i++) {
    if (users[i].checked) {
      users[i].parentElement.style.display = "block";
    } else {
      users[i].parentElement.style.display = "none";
    }
  }
}

function cfcbCheckAll(tagname) {
  var users = $('input[name="' + tagname + '"]');
  for (var i = 0, len = users.length - 1; i < len; i++) {
    users[i].checked = true;
  }
  cfcbShowAll(tagname);
}

function cfcbUncheckAll(tagname) {
  var users = $('input[name="' + tagname + '"]');
  for (var i = 0, len = users.length - 1; i < len; i++) {
    users[i].checked = false;
  }
}

function cfcbFilter(tagname) {
  var users = $('input[name="' + tagname + '"]');
  var filter = $('input[name="filter_' + tagname + '"]');
  for (var i = 0, len = users.length - 1; i < len; i++) {
    regexp = new RegExp(filter[0].value, "i");
    if (users[i].parentNode.textContent.match(regexp)) {
      users[i].parentElement.style.display = "block";
    } else {
      users[i].parentElement.style.display = "none";
    }
  }
}

function cfcbGroupAll(tagname, check) {
  var users = $('input[name="' + tagname + '"]');
  var groupuserids = $('[name="group_' + tagname + '"]')
    .val()
    .split(",");
  for (var i = 0, len = users.length - 1; i < len; i++) {
    if (groupuserids.includes(users[i].value)) {
      users[i].checked = check;
    }
  }
  cfcbShowAll(tagname);
}

function cfcbCheckGroupAll(tagname) {
  cfcbGroupAll(tagname, true);
}

function cfcbUncheckGroupAll(tagname) {
  cfcbGroupAll(tagname, false);
}

function cfcbGroupChanged(tagname) {
  var users = $('input[name="' + tagname + '"]');
  var groupselect = $('[name="group_' + tagname + '"]');
  if (groupselect.length > 0) {
    var groupuserids = groupselect.val().split(",");
    for (var i = 0, len = users.length - 1; i < len; i++) {
      if (groupuserids.includes(users[i].value)) {
        users[i].parentElement.style.color = "blue";
      } else {
        users[i].parentElement.style.color = "";
      }
    }
  }
}

function adjustHeight() {
  const checkBoxGroups = document.querySelectorAll(".check_box_group");
  const increment = 32; // 每次調整的高度增量

  checkBoxGroups.forEach((group) => {
    console.log(group);

    const adjust = () => {
      // 若橫向溢出調整高度
      if (group.scrollWidth > group.clientWidth) {
        console.log(
          `scrollWidth: ${group.scrollWidth}, clientWidth: ${group.clientWidth}`,
        );
        console.log("Width overflowing");
        group.style.height = `${group.clientHeight + increment}px`;
        requestAnimationFrame(adjust);
        return;
      }

      // if reach inhierent max-height, stop adjusting
      max_height = parseInt(
        window.getComputedStyle(group).getPropertyValue("max-height"),
      );
      // 垂直高度調整
      if (
        group.scrollHeight > group.clientHeight &&
        max_height > group.clientHeight
      ) {
        console.log(
          `clientHeight: ${group.clientHeight}, max-height: ${max_height}, scrollHeight: ${group.scrollHeight}`,
        );
        console.log("Height overflowing");
        group.style.height = `${group.scrollHeight}px`;
        requestAnimationFrame(adjust);
        return;
      }
    };

    // 開始調整高度
    adjust();
  });
}

function appendToFunction(fnName, callback) {
  const originalFn = window[fnName];
  window[fnName] = function (...args) {
    originalFn.apply(this, args);
    callback.apply(this, args);
  };
}

// hook into the showAndScrollTo function
appendToFunction("showAndScrollTo", adjustHeight);

window.addEventListener("resize", adjustHeight);
window.addEventListener("load", adjustHeight);
