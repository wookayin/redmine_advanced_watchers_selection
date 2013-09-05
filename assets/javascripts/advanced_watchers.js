(function($, undefined) {

	var AdvancedWatchers = {};

  // initialize plugin by adjusting position of the DOM object.
  $(document).ready(function() {
	  $("#watchers-advanced").show().appendTo($("#watchers_form"));

		AdvancedWatchers.init();
  });

	AdvancedWatchers.init = function() {
		this.$selectbox = $("#watchers-select");
		this.$checkboxes = $("#watchers_inputs input[type=checkbox]");
		this.$watchers_autocomplete = this.$selectbox.select2();

		this.$watchers_autocomplete.change(function() {
			AdvancedWatchers.syncToCheckboxes();
		});
		$("#watchers_inputs").on('change', 'input[type=checkbox]', function() {
			AdvancedWatchers.syncFromCheckboxes();
		});
	};

	// synchronize select2 -> checkbox
	AdvancedWatchers.syncToCheckboxes = function() {
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
	AdvancedWatchers.syncFromCheckboxes = function() {
		var self = this;
		var selected_watcher_userids = self.$selectbox.val();	// previously exist
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

})(jQuery);	// Requires Redmine 2.1+
