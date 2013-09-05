(function($, undefined) {

  var AdvancedWatchers = {
    AutoComplete: {},
    ByGroup : {}
  };

  // initialize plugin by adjusting position of the DOM object.
  $(document).ready(function() {
    $("#watchers-advanced").show().appendTo($("#watchers_form"));

    AdvancedWatchers.AutoComplete.init();
    AdvancedWatchers.ByGroup.init();
  });

  AdvancedWatchers.AutoComplete.init = function() {
    var self = this;
    this.$selectbox = $("#watchers-select");
    this.$checkboxes = $("#watchers_inputs input[type=checkbox]");
    this.$watchers_autocomplete = this.$selectbox.select2({
    });

    this.$watchers_autocomplete.change(function() {
      self.syncToCheckboxes();
    });
    $("#watchers_inputs").on('change', 'input[type=checkbox]', function() {
      self.syncFromCheckboxes();
    });
  };

  // synchronize select2 -> checkbox
  AdvancedWatchers.AutoComplete.syncToCheckboxes = function() {
    var self = this;
    var selected_watcher_userids = self.$selectbox.val();
    self.$checkboxes.prop('checked', false);

    if(!selected_watcher_userids) selected_watcher_userids = [];
    for(var i = 0; i < selected_watcher_userids.length; ++ i) {
      var userid = selected_watcher_userids[i];
      self.$checkboxes.filter("[value=" + userid + "]").prop('checked', true);
    }
  };

  // synchronize checkbox -> select2
  AdvancedWatchers.AutoComplete.syncFromCheckboxes = function() {
    var self = this;
    var selected_watcher_userids = self.$selectbox.val();  // previously exist
    var userid_exists = {};
    if(!selected_watcher_userids) selected_watcher_userids = [];
    for(var i = 0; i < selected_watcher_userids.length; ++ i) {
      userid_exists[ selected_watcher_userids[i] ] = true;
    }
    self.$checkboxes.each( function() {
      var user_id = $(this).val();
      if( $(this).is(':checked') ) {
        // append if not exists
        if(!userid_exists[user_id]) selected_watcher_userids.push(user_id);
        userid_exists[user_id] = true;
      } else {
        // remove
        userid_exists[user_id] = false;
      }
    });
    selected_watcher_userids = $.grep(selected_watcher_userids, function(v, i) { return userid_exists[v]; });
    self.$selectbox.val(selected_watcher_userids).trigger("change");
  };


  AdvancedWatchers.ByGroup.init = function() {
    var self = this;
    self.$el = $('#watchers-advanced > .watchers-advanced-by-group');
    self.$checkboxes = $("#watchers_inputs input[type=checkbox]");

    var sync = function() {
      // TODO change and remove this function (use by event binding)
      AdvancedWatchers.AutoComplete.syncFromCheckboxes();
    };

    // register event handlers for buttons
    self.$el.find('.action-select-all').click(function() {
      self.$checkboxes.prop('checked', true);
      sync();
    });
    self.$el.find('.action-unselect-all').click(function() {
      self.$checkboxes.prop('checked', false);
      sync();
    });

    var setCheckboxesInTheGroup = function(isChecked) {
      var usersInGroup = $('#watcher_multiple_group').val().split(',');
      var userid_target = {};
      for(var i = 0; i < usersInGroup.length; ++ i) {
        userid_target[ usersInGroup[i] ] = true;
      }

      self.$checkboxes.each( function() {
        var user_id = $(this).val();
        if(userid_target[user_id]) $(this).prop('checked', isChecked);
      });
    };

    self.$el.find('.action-select').click(function() {
      setCheckboxesInTheGroup(true);
      sync();
    });
    self.$el.find('.action-unselect').click(function() {
      setCheckboxesInTheGroup(false);
      sync();
    });

  };

})(jQuery);  // Requires Redmine 2.1+
