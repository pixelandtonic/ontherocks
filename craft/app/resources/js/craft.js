/*!
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2013, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license1.0.html Craft License
 * @link      http://buildwithcraft.com
 */

(function($){

if (typeof Craft == 'undefined')
{
	Craft = {};
}

Craft = $.extend(Craft, {

	navHeight: 48,

	/**
	 * Map of high-ASCII codes to their low-ASCII characters.
	 *
	 * @var object
	 */
	asciiCharMap: {
		'223':'ss', '224':'a',  '225':'a',  '226':'a',  '229':'a',  '227':'ae', '230':'ae', '228':'ae', '231':'c',  '232':'e',
		'233':'e',  '234':'e',  '235':'e',  '236':'i',  '237':'i',  '238':'i',  '239':'i',  '241':'n',  '242':'o',  '243':'o',
		'244':'o',  '245':'o',  '246':'oe', '249':'u',  '250':'u',  '251':'u',  '252':'ue', '255':'y',  '257':'aa', '269':'ch',
		'275':'ee', '291':'gj', '299':'ii', '311':'kj', '316':'lj', '326':'nj', '353':'sh', '363':'uu', '382':'zh', '256':'aa',
		'268':'ch', '274':'ee', '290':'gj', '298':'ii', '310':'kj', '315':'lj', '325':'nj', '352':'sh', '362':'uu', '381':'zh'
	},

	/**
	 * Get a translated message.
	 *
	 * @param string message
	 * @param object params
	 * @return string
	 */
	t: function(message, params)
	{
		if (typeof Craft.translations[message] != 'undefined')
			message = Craft.translations[message];

		if (params)
		{
			for (var key in params)
			{
				message = message.replace('{'+key+'}', params[key])
			}
		}

		return message;
	},

	/**
	 * Returns whether a package is included in this Craft build.
	 *
	 * @return bool
	 * @param pkg
	 */
	hasPackage: function(pkg)
	{
		return ($.inArray(pkg, Craft.packages) != -1);
	},

	/**
	 * @return string
	 * @param path
	 * @param params
	 */
	getUrl: function(path, params)
	{
		// Return path if it appears to be an absolute URL.
		if (path.search('://') != -1)
		{
			return path;
		}

		path = Craft.trim(path, '/');

		var anchor = '';

		// Normalize the params
		if (Garnish.isObject(params))
		{
			var aParams = [];

			for (var name in params)
			{
				var value = params[name];

				if (name == '#')
				{
					anchor = value;
				}
				else if (value !== null && value !== '')
				{
					aParams.push(name+'='+value);
				}
			}

			params = aParams;
		}

		if (Garnish.isArray(params))
		{
			params = params.join('&');
		}
		else
		{
			params = Craft.ltrim(params, '&');
		}

		// Put it all together
		var url = Craft.baseUrl;

		// Does the base URL already have a query string?
		var qsMarker = url.indexOf('?');
		if (qsMarker != '-1')
		{
			// Append params with the existing query string, and chop it off of the base URL
			var qs = url.substr(qsMarker+1);
			url = url.substr(0, qsMarker);

			if (qs)
			{
				params = qs + (params ? '&'+params : '');
			}
		}

		if (!Craft.usePathInfo && path)
		{
			// Is the p= param already set?
			if (params && params.substr(0, 2) == 'p=')
			{
				var endPath = params.indexOf('&');
				if (endPath != -1)
				{
					var basePath = params.substring(2, endPath-1);
					params = params.substr(endPath+1);
				}
				else
				{
					var basePath = params.substr(2);
					params = null;
				}

				path = basePath + (path ? '/'+path : '');
			}

			// Now move the path into the params
			params = 'p='+path + (params ? '&'+params : '');
			path = null;
		}

		if (path)
		{
			url += '/'+path;
		}

		if (params)
		{
			url += '?'+params;
		}

		if (anchor)
		{
			url += '#'+anchor;
		}

		return url;
	},

	/**
	 * Returns a resource URL.
	 *
	 * @param string path
	 * @param array|string|null params
	 * @return string
	 */
	getResourceUrl: function(path, params)
	{
		path = Craft.resourceTrigger+'/'+Craft.trim(path, '/');
		return Craft.getUrl(path, params);
	},

	/**
	 * Returns an action URL.
	 *
	 * @param string path
	 * @param array|string|null params
	 * @return string
	 */
	getActionUrl: function(path, params)
	{
		path = Craft.actionTrigger+'/'+Craft.trim(path, '/');
		return Craft.getUrl(path, params);
	},

	/**
	 * Posts an action request to the server.
	 *
	 * @param string action
	 * @param object|null data
	 * @param function|null onSuccess
	 * @param funciton|null onError
	 */
	postActionRequest: function(action, data, onSuccess, onError)
	{
		var url = Craft.getActionUrl(action);

		// Param mapping
		if (typeof data == 'function')
		{
			// (action, onSuccess, onError)
			onError = onSuccess;
			onSuccess = data;
			data = {};
		}

		return $.ajax(url, {
			type: 'POST',
			data: data,
			success: onSuccess,
			error: onError
		});
	},

	/**
	 * Converts a comma-delimited string into an array.
	 *
	 * @param string str
	 * @return array
	 */
	stringToArray: function(str)
	{
		if (typeof str != 'string')
			return str;

		var arr = str.split(',');
		for (var i = 0; i < arr.length; i++)
		{
			arr[i] = $.trim(arr[i]);
		}
		return arr;
	},

	/**
	 * Takes an array or string of chars, and places a backslash before each one, returning the combined string.
	 *
	 * Userd by ltrim() and rtrim()
	 *
	 * @param string|array chars
	 * @return string
	 */
	escapeChars: function(chars)
	{
		if (!Garnish.isArray(chars))
		{
			chars = chars.split();
		}

		var escaped = '';

		for (var i = 0; i < chars.length; i++)
		{
			escaped += "\\"+chars[i];
		}

		return escaped;
	},

	/**
	 * Trim characters off of the beginning of a string.
	 *
	 * @param string str
	 * @param string|array|null The characters to trim off. Defaults to a space if left blank.
	 * @return string
	 */
	ltrim: function(str, chars)
	{
		if (!str) return str;
		if (chars === undefined) chars = ' ';
		var re = new RegExp('^['+Craft.escapeChars(chars)+']+');
		return str.replace(re, '');
	},

	/**
	 * Trim characters off of the end of a string.
	 *
	 * @param string str
	 * @param string|array|null The characters to trim off. Defaults to a space if left blank.
	 * @return string
	 */
	rtrim: function(str, chars)
	{
		if (!str) return str;
		if (chars === undefined) chars = ' ';
		var re = new RegExp('['+Craft.escapeChars(chars)+']+$');
		return str.replace(re, '');
	},

	/**
	 * Trim characters off of the beginning and end of a string.
	 *
	 * @param string str
	 * @param string|array|null The characters to trim off. Defaults to a space if left blank.
	 * @return string
	 */
	trim: function(str, chars)
	{
		str = Craft.ltrim(str, chars);
		str = Craft.rtrim(str, chars);
		return str;
	},

	/**
	 * Filters an array.
	 *
	 * @param array    arr
	 * @param function callback A user-defined callback function. If null, we'll just remove any elements that equate to false.
	 * @return array
	 */
	filterArray: function(arr, callback)
	{
		var filtered = [];

		for (var i = 0; i < arr.length; i++)
		{
			if (typeof callback == 'function')
			{
				var include = callback(arr[i], i);
			}
			else
			{
				var include = arr[i];
			}

			if (include)
			{
				filtered.push(arr[i]);
			}
		}

		return filtered;
	},

	/**
	 * Returns whether an element is in an array (unlike jQuery.inArray(), which returns the element's index, or -1).
	 *
	 * @param mixed elem
	 * @param mixed arr
	 * @return bool
	 */
	inArray: function(elem, arr)
	{
		return ($.inArray(elem, arr) != -1);
	},

	/**
	 * Removes an element from an array.
	 *
	 * @param mixed elem
	 * @param array arr
	 * @return bool Whether the element could be found or not.
	 */
	removeFromArray: function(elem, arr)
	{
		var index = $.inArray(elem, arr);
		if (index != -1)
		{
			arr.splice(index, 1);
			return true;
		}
		else
		{
			return false;
		}
	},

	/**
	 * Returns the last element in an array.
	 *
	 * @param array
	 * @return mixed
	 */
	getLast: function(arr)
	{
		if (!arr.length)
			return null;
		else
			return arr[arr.length-1];
	},

	/**
	 * Makes the first character of a string uppercase.
	 *
	 * @param string str
	 * @return string
	 */
	uppercaseFirst: function(str)
	{
		return str.charAt(0).toUpperCase() + str.slice(1);
	},

	/**
	 * Makes the first character of a string lowercase.
	 *
	 * @param string str
	 * @return string
	 */
	lowercaseFirst: function(str)
	{
		return str.charAt(0).toLowerCase() + str.slice(1);
	},

	/**
	 * Converts extended ASCII characters to ASCII.
	 *
	 * @param string str
	 * @return string
	 */
	asciiString: function(str)
	{
		var asciiStr = '';

		for (var c = 0; c < str.length; c++)
		{
			var ascii = str.charCodeAt(c);

			if (ascii >= 32 && ascii < 128)
			{
				asciiStr += str.charAt(c);
			}
			else if (typeof Craft.asciiCharMap[ascii] != 'undefined')
			{
				asciiStr += Craft.asciiCharMap[ascii];
			}
		}

		return asciiStr;
	},

	/**
	 * Prevents the outline when an element is focused by the mouse.
	 *
	 * @param mixed elem Either an actual element or a jQuery collection.
	 */
	preventOutlineOnMouseFocus: function(elem)
	{
		var $elem = $(elem),
			namespace = '.preventOutlineOnMouseFocus';

		$elem.on('mousedown'+namespace, function() {
			$elem.addClass('no-outline');
			$elem.focus();
		})
		.on('keydown'+namespace+' blur'+namespace, function(event) {
			if (event.keyCode != Garnish.SHIFT_KEY && event.keyCode != Garnish.CTRL_KEY && event.keyCode != Garnish.CMD_KEY)
				$elem.removeClass('no-outline');
		});
	},

	/**
	 * Creates a validation error list.
	 *
	 * @param array errors
	 * @return jQuery
	 */
	createErrorList: function(errors)
	{
		var $ul = $(document.createElement('ul')).addClass('errors');

		for (var i = 0; i < errors.length; i++)
		{
			var $li = $(document.createElement('li'));
			$li.appendTo($ul);
			$li.html(errors[i]);
		}

		return $ul;
	}
});


// -------------------------------------------
//  Custom jQuery plugins
// -------------------------------------------

$.extend($.fn, {

	/**
	 * Disables elements by adding a .disabled class and preventing them from receiving focus.
	 */
	disable: function()
	{
		return this.each(function()
		{
			var $elem = $(this);
			$elem.addClass('disabled');

			if ($elem.data('activatable'))
			{
				$elem.removeAttr('tabindex');
			}
		});
	},

	/**
	 * Enables elements by removing their .disabled class and allowing them to receive focus.
	 */
	enable: function()
	{
		return this.each(function()
		{
			var $elem = $(this);
			$elem.removeClass('disabled');

			if ($elem.data('activatable'))
			{
				$elem.attr('tabindex', '0');
			}
		});
	},

	/**
	 * Sets the element as a container for a checkbox select.
	 */
	checkboxselect: function()
	{
		return this.each(function()
		{
			if (!$.data(this, 'checkboxselect'))
			{
				new Garnish.CheckboxSelect(this);
			}
		});
	},

	/**
	 * Sets the element as a field toggle trigger.
	 */
	fieldtoggle: function()
	{
		return this.each(function()
		{
			if (!$.data(this, 'fieldtoggle'))
			{
				new Craft.FieldToggle(this);
			}
		});
	},

	lightswitch: function(settings, settingName, settingValue)
	{
		// param mapping
		if (settings == 'settings')
		{
			if (typeof settingName == 'string')
			{
				settings = {};
				settings[settingName] = settingValue;
			}
			else
			{
				settings = settingName;
			}

			return this.each(function()
			{
				var obj = $.data(this, 'lightswitch');
				if (obj)
				{
					obj.setSettings(settings);
				}
			});
		}

		return this.each(function()
		{
			if (!$.data(this, 'lightswitch'))
			{
				new Craft.LightSwitch(this, settings);
			}
		});
	},

	nicetext: function()
	{
		return this.each(function()
		{
			if (!$.data(this, 'text'))
			{
				new Garnish.NiceText(this, {hint: this.getAttribute('data-hint')});
			}
		});
	},

	passwordinput: function()
	{
		return this.each(function()
		{
			if (!$.data(this, 'passwordinput'))
			{
				new Garnish.PasswordInput(this);
			}
		});
	},

	pill: function()
	{
		return this.each(function()
		{
			if (!$.data(this, 'pill'))
			{
				new Garnish.Pill(this);
			}
		});
	},

	menubtn: function()
	{
		return this.each(function()
		{
			if (!$.data(this, 'menubtn'))
			{
				new Garnish.MenuBtn(this);
			}
		});
	}
});


Garnish.$doc.ready(function()
{
	$('.checkbox-select').checkboxselect();
	$('.fieldtoggle').fieldtoggle();
	$('.lightswitch').lightswitch();
	$('.nicetext').nicetext();
	$('input.password').passwordinput();
	$('.pill').pill();
	$('.menubtn').menubtn();
});


/**
 * Input Generator
 */
Craft.BaseInputGenerator = Garnish.Base.extend({

	$source: null,
	$target: null,

	listening: null,

	init: function(source, target)
	{
		this.$source = $(source);
		this.$target = $(target);

		this.startListening();
	},

	startListening: function()
	{
		if (this.listening)
			return;

		this.listening = true;

		this.addListener(this.$source, 'keypress,keyup,change,blur', 'updateTarget');
		this.addListener(this.$target, 'keypress,keyup,change', 'stopListening');
	},

	stopListening: function()
	{
		if (!this.listening)
			return;

		this.listening = false;

		this.removeAllListeners(this.$source);
		this.removeAllListeners(this.$target);
	},

	updateTarget: function()
	{
		var sourceVal = this.$source.val(),
			targetVal = this.generateTargetValue(sourceVal);

		this.$target.val(targetVal);
	},

	generateTargetValue: function(sourceVal)
	{
		return sourceVal;
	}
});


/**
 * Admin table class
 */
Craft.AdminTable = Garnish.Base.extend({

	settings: null,
	totalObjects: null,
	sorter: null,

	$noObjects: null,
	$table: null,
	$tbody: null,
	$deleteBtns: null,

	init: function(settings)
	{
		this.setSettings(settings, Craft.AdminTable.defaults);

		this.$noObjects = $(this.settings.noObjectsSelector);
		this.$table = $(this.settings.tableSelector);
		this.$tbody  = this.$table.children('tbody');
		this.totalObjects = this.$tbody.children().length;

		if (this.settings.sortable)
		{
			this.sorter = new Craft.DataTableSorter(this.$table, {
				onSortChange: $.proxy(this, 'reorderObjects')
			});
		}

		this.$deleteBtns = this.$table.find('.delete');
		this.addListener(this.$deleteBtns, 'click', 'deleteObject');

		this.onDeleteObject();
	},

	addRow: function(row)
	{
		var $row = $(row).appendTo(this.$tbody),
			$deleteBtn = $row.find('.delete');

		if (this.settings.sortable)
		{
			this.sorter.addItems($row);
		}

		this.addListener($deleteBtn, 'click', 'deleteObject');
		this.totalObjects++;

		if (this.totalObjects == 1)
		{
			this.$noObjects.addClass('hidden');
			this.$table.show();
		}
		else if (this.totalObjects == 2)
		{
			if (this.settings.sortable)
			{
				this.$table.find('.move').removeClass('disabled');
			}

			if (!this.settings.allowDeleteAll)
			{
				this.$deleteBtns.removeClass('disabled');
			}
		}

		this.$deleteBtns = this.$deleteBtns.add($deleteBtn);
	},

	reorderObjects: function()
	{
		if (!this.settings.sortable)
		{
			return false;
		}

		// Get the new field order
		var ids = [];

		for (var i = 0; i < this.sorter.$items.length; i++)
		{
			var id = $(this.sorter.$items[i]).attr(this.settings.idAttribute);
			ids.push(id);
		}

		// Send it to the server
		var data = {
			ids: JSON.stringify(ids)
		};

		Craft.postActionRequest(this.settings.reorderAction, data, $.proxy(function(response)
		{
			if (response.success)
			{
				Craft.cp.displayNotice(Craft.t(this.settings.reorderSuccessMessage));
			}
			else
			{
				Craft.cp.displayError(Craft.t(this.settings.reorderFailMessage));
			}
		}, this));
	},

	deleteObject: function(event)
	{
		if (!this.settings.allowDeleteAll && this.totalObjects == 1)
		{
			return;
		}

		var $row = $(event.target).closest('tr'),
			id = $row.attr(this.settings.idAttribute),
			name = $row.attr(this.settings.nameAttribute);

		if (this.confirmDeleteObject($row))
		{
			Craft.postActionRequest(this.settings.deleteAction, { id: id }, $.proxy(function(response) {
				if (response.success)
				{
					$row.remove();
					this.totalObjects--;
					this.onDeleteObject();
					this.settings.onDeleteObject(id);

					Craft.cp.displayNotice(Craft.t(this.settings.deleteSuccessMessage, { name: name }));
				}
				else
				{
					Craft.cp.displayError(Craft.t(this.settings.deleteFailMessage, { name: name }));
				}
			}, this));
		}
	},

	confirmDeleteObject: function($row)
	{
		var name = $row.attr(this.settings.nameAttribute);
		return confirm(Craft.t(this.settings.confirmDeleteMessage, { name: name }));
	},

	onDeleteObject: function()
	{
		if (this.totalObjects == 1)
		{
			this.$table.find('.move').addClass('disabled');

			if (!this.settings.allowDeleteAll)
			{
				this.$deleteBtns.addClass('disabled');
			}
		}
		else if (this.totalObjects == 0)
		{
			this.$table.hide();
			$(this.settings.noObjectsSelector).removeClass('hidden');
		}
	}
},
{
	defaults: {
		tableSelector: null,
		noObjectsSelector: null,
		idAttribute: 'data-id',
		nameAttribute: 'data-name',
		sortable: false,
		allowDeleteAll: true,
		reorderAction: null,
		deleteAction: null,
		reorderSuccessMessage: 'New order saved.',
		reorderFailMessage: 'Couldn’t save new order.',
		confirmDeleteMessage: 'Are you sure you want to delete “{name}”?',
		deleteSuccessMessage: '“{name}” deleted.',
		deleteFailMessage: 'Couldn’t delete “{name}”.',
		onDeleteObject: $.noop
	}
});


/**
 * DataTableSorter
 */
Craft.DataTableSorter = Garnish.DragSort.extend({

	$table: null,

	init: function(table, settings)
	{
		this.$table = $(table);
		var $rows = this.$table.children('tbody').children(':not(.filler)');

		settings = $.extend({}, Craft.DataTableSorter.defaults, settings);

		settings.container = this.$table.children('tbody');
		settings.helper = $.proxy(this, 'getHelper');
		settings.caboose = '<tr/>';
		settings.axis = Garnish.Y_AXIS;

		this.base($rows, settings);
	},

	getHelper: function($helperRow)
	{
		var $helper = $('<div class="'+this.settings.helperClass+'"/>').appendTo(Garnish.$bod),
			$table = $('<table/>').appendTo($helper),
			$tbody = $('<tbody/>').appendTo($table);

		$helperRow.appendTo($tbody);

		// Copy the table width and classes
		$table.width(this.$table.width());
		$table.prop('className', this.$table.prop('className'));

		// Copy the column widths
		var $firstRow = this.$table.find('tr:first'),
			$cells = $firstRow.children(),
			$helperCells = $helperRow.children();

		for (var i = 0; i < $helperCells.length; i++)
		{
			$($helperCells[i]).width($($cells[i]).width());
		}

		return $helper;
	}

},
{
	defaults: {
		handle: '.move',
		helperClass: 'datatablesorthelper'
	}
});


/**
 * Handle Generator
 */
Craft.EntryUrlFormatGenerator = Craft.BaseInputGenerator.extend({

	generateTargetValue: function(sourceVal)
	{
		// Remove HTML tags
		sourceVal = sourceVal.replace("/<(.*?)>/g", '');

		// Make it lowercase
		sourceVal = sourceVal.toLowerCase();

		// Convert extended ASCII characters to basic ASCII
		sourceVal = Craft.asciiString(sourceVal);

		// Handle must start with a letter and end with a letter/number
		sourceVal = sourceVal.replace(/^[^a-z]+/, '');
		sourceVal = sourceVal.replace(/[^a-z0-9]+$/, '');

		// Get the "words"
		var words = Craft.filterArray(sourceVal.split(/[^a-z0-9]+/));

		if (words.length)
			return words.join('-') + '/{slug}';

		return '';
	}
});


Craft.FieldLayoutDesigner = Garnish.Base.extend({

	$container: null,
	$tabContainer: null,
	$unusedFieldContainer: null,
	$newTabBtn: null,
	$allFields: null,

	tabGrid: null,
	unusedFieldGrid: null,

	tabDrag: null,
	fieldDrag: null,

	init: function(container, settings)
	{
		this.$container = $(container);
		this.setSettings(settings, Craft.FieldLayoutDesigner.defaults);

		this.$tabContainer = this.$container.children('.fld-tabs');
		this.$unusedFieldContainer = this.$container.children('.unusedfields');
		this.$newTabBtn = $('#newtabbtn');
		this.$allFields = this.$unusedFieldContainer.find('.fld-field');

		// Set up the layout grids
		this.tabGrid = new Craft.Grid(this.$tabContainer, Craft.FieldLayoutDesigner.gridSettings);
		this.unusedFieldGrid = new Craft.Grid(this.$unusedFieldContainer, Craft.FieldLayoutDesigner.gridSettings);

		var $tabs = this.$tabContainer.children();
		for (var i = 0; i < $tabs.length; i++)
		{
			this.initTab($($tabs[i]));
		}

		this.fieldDrag = new Craft.FieldLayoutDesigner.FieldDrag(this);

		if (this.settings.customizableTabs)
		{
			this.tabDrag = new Craft.FieldLayoutDesigner.TabDrag(this);

			this.addListener(this.$newTabBtn, 'activate', 'addTab');
		}
	},

	initTab: function($tab)
	{
		if (this.settings.customizableTabs)
		{
			var $editBtn = $tab.find('.tabs .settings'),
				$menu = $('<div class="menu" data-align="center"/>').insertAfter($editBtn),
				$ul = $('<ul/>').appendTo($menu);

			$('<li><a data-action="rename">'+Craft.t('Rename…')+'</a></li>').appendTo($ul);
			$('<li><a data-action="delete">'+Craft.t('Delete')+'</a></li>').appendTo($ul);

			new Garnish.MenuBtn($editBtn, {
				onOptionSelect: $.proxy(this, 'onTabOptionSelect')
			});
		}

		// Don't forget the fields!
		var $fields = $tab.children('.fld-tabcontent').children();

		for (var i = 0; i < $fields.length; i++)
		{
			this.initField($($fields[i]));
		}
	},

	initField: function($field)
	{
		var $editBtn = $field.find('.settings'),
			$menu = $('<div class="menu" data-align="center"/>').insertAfter($editBtn),
			$ul = $('<ul/>').appendTo($menu);

		if ($field.hasClass('fld-required'))
		{
			$('<li><a data-action="toggle-required">'+Craft.t('Make not required')+'</a></li>').appendTo($ul);
		}
		else
		{
			$('<li><a data-action="toggle-required">'+Craft.t('Make required')+'</a></li>').appendTo($ul);
		}

		$('<li><a data-action="remove">'+Craft.t('Remove')+'</a></li>').appendTo($ul);

		new Garnish.MenuBtn($editBtn, {
			onOptionSelect: $.proxy(this, 'onFieldOptionSelect')
		});
	},

	onTabOptionSelect: function(option)
	{
		if (!this.settings.customizableTabs)
		{
			return;
		}

		var $option = $(option),
			$tab = $option.data('menu').$btn.parent().parent().parent(),
			action = $option.data('action');

		switch (action)
		{
			case 'rename':
			{
				this.renameTab($tab);
				break;
			}
			case 'delete':
			{
				this.deleteTab($tab);
				break;
			}
		}
	},

	onFieldOptionSelect: function(option)
	{
		var $option = $(option),
			$field = $option.data('menu').$btn.parent(),
			action = $option.data('action');

		switch (action)
		{
			case 'toggle-required':
			{
				this.toggleRequiredField($field, $option);
				break;
			}
			case 'remove':
			{
				this.removeField($field);
				break;
			}
		}
	},

	renameTab: function($tab)
	{
		if (!this.settings.customizableTabs)
		{
			return;
		}

		var $labelSpan = $tab.find('.tabs .tab span'),
			oldName = $labelSpan.text(),
			newName = prompt(Craft.t('Give your tab a name.'), oldName);

		if (newName && newName != oldName)
		{
			$labelSpan.text(newName);
			$tab.find('.id-input').attr('name', 'fieldLayout['+encodeURIComponent(newName)+'][]');
		}
	},

	deleteTab: function($tab)
	{
		if (!this.settings.customizableTabs)
		{
			return;
		}

		// Find all the fields in this tab
		var $fields = $tab.find('.fld-field');

		for (var i = 0; i < $fields.length; i++)
		{
			var fieldId = $($fields[i]).attr('data-id');
			this.removeFieldById(fieldId);
		}

		this.tabGrid.removeItems($tab);
		this.tabDrag.removeItems($tab);

		$tab.remove();
	},

	toggleRequiredField: function($field, $option)
	{
		if ($field.hasClass('fld-required'))
		{
			$field.removeClass('fld-required');
			$field.find('.required-input').remove();

			setTimeout(function() {
				$option.text(Craft.t('Make required'));
			}, 500);
		}
		else
		{
			$field.addClass('fld-required');
			$('<input class="required-input" type="hidden" name="requiredFields[]" value="'+$field.data('id')+'">').appendTo($field);

			setTimeout(function() {
				$option.text(Craft.t('Make not required'));
			}, 500);
		}
	},

	removeField: function($field)
	{
		var fieldId = $field.attr('data-id');

		$field.remove();

		this.removeFieldById(fieldId);
		this.tabGrid.refreshCols();
	},

	removeFieldById: function(fieldId)
	{
		var $field = this.$allFields.filter('[data-id='+fieldId+']:first'),
			$group = $field.closest('.fld-tab');

		$field.removeClass('hidden');

		if ($group.hasClass('hidden'))
		{
			$group.removeClass('hidden');
			this.unusedFieldGrid.addItems($group);

			if (this.settings.customizableTabs)
			{
				this.tabDrag.addItems($group);
			}
		}
		else
		{
			this.unusedFieldGrid.refreshCols();
		}
	},

	addTab: function()
	{
		if (!this.settings.customizableTabs)
		{
			return;
		}

		var $tab = $('<div class="fld-tab">' +
						'<div class="tabs">' +
							'<div class="tab sel draggable">' +
								'<span>Tab '+(this.tabGrid.$items.length+1)+'</span>' +
								'<a class="settings icon" title="'+Craft.t('Rename')+'"></a>' +
							'</div>' +
						'</div>' +
						'<div class="fld-tabcontent"></div>' +
					'</div>').appendTo(this.$tabContainer);

		this.tabGrid.addItems($tab);
		this.tabDrag.addItems($tab);

		this.initTab($tab);
	}
},
{
	gridSettings: {
		minColWidth: 240,
		percentageWidths: false,
		fillMode: 'grid',
		snapToGrid: 30
	},
	defaults: {
		customizableTabs: true
	}
});


Craft.FieldLayoutDesigner.BaseDrag = Garnish.Drag.extend({

	designer: null,
	$insertion: null,
	showingInsertion: false,
	$caboose: null,
	draggingUnusedItem: false,
	addToTabGrid: false,

	/**
	 * Constructor
	 */
	init: function(designer, settings)
	{
		this.designer = designer;

		// Find all the items from both containers
		var $items = this.designer.$tabContainer.find(this.itemSelector)
			.add(this.designer.$unusedFieldContainer.find(this.itemSelector));

		this.base($items, settings);
	},

	/**
	 * On Drag Start
	 */
	onDragStart: function()
	{
		this.base();

		// Are we dragging an unused item?
		this.draggingUnusedItem = this.$draggee.hasClass('unused');

		// Create the insertion
		this.$insertion = this.getInsertion();

		// Add the caboose
		this.addCaboose();
		this.$items = $().add(this.$items.add(this.$caboose));

		if (this.addToTabGrid)
		{
			this.designer.tabGrid.addItems(this.$caboose);
		}

		// Swap the draggee with the insertion if dragging a selected item
		if (this.draggingUnusedItem)
		{
			this.showingInsertion = false;
		}
		else
		{
			// Actually replace the draggee with the insertion
			this.$insertion.insertBefore(this.$draggee);
			this.$draggee.detach();
			this.$items = $().add(this.$items.not(this.$draggee).add(this.$insertion));
			this.showingInsertion = true;

			if (this.addToTabGrid)
			{
				this.designer.tabGrid.removeItems(this.$draggee);
				this.designer.tabGrid.addItems(this.$insertion);
			}
		}

		this.setMidpoints();
	},

	/**
	 * Append the caboose
	 */
	addCaboose: $.noop,

	/**
	 * Returns the item's container
	 */
	getItemContainer: $.noop,

	/**
	 * Tests if an item is within the tab container.
	 */
	isItemInTabContainer: function($item)
	{
		return (this.getItemContainer($item)[0] == this.designer.$tabContainer[0]);
	},

	/**
	 * Sets the item midpoints up front so we don't have to keep checking on every mouse move
	 */
	setMidpoints: function()
	{
		for (var i = 0; i < this.$items.length; i++)
		{
			var $item = $(this.$items[i]);

			// Skip the unused tabs
			if (!this.isItemInTabContainer($item))
			{
				continue;
			}

			var offset = $item.offset();

			$item.data('midpoint', {
				left: offset.left + $item.outerWidth() / 2,
				top:  offset.top + $item.outerHeight() / 2
			});
		}
	},

	/**
	 * On Drag
	 */
	onDrag: function()
	{
		// Are we hovering over the tab container?
		if (this.draggingUnusedItem && !Garnish.hitTest(this.mouseX, this.mouseY, this.designer.$tabContainer))
		{
			if (this.showingInsertion)
			{
				this.$insertion.remove();
				this.$items = $().add(this.$items.not(this.$insertion));
				this.showingInsertion = false;

				if (this.addToTabGrid)
				{
					this.designer.tabGrid.removeItems(this.$insertion);
				}
				else
				{
					this.designer.tabGrid.refreshCols();
				}

				this.setMidpoints();
			}
		}
		else
		{
			// Is there a new closest item?
			this.onDrag._closestItem = this.getClosestItem();

			if (this.onDrag._closestItem != this.$insertion[0])
			{
				if (this.showingInsertion &&
					($.inArray(this.$insertion[0], this.$items) < $.inArray(this.onDrag._closestItem, this.$items)) &&
					($.inArray(this.onDrag._closestItem, this.$caboose) == -1)
				)
				{
					this.$insertion.insertAfter(this.onDrag._closestItem);
				}
				else
				{
					this.$insertion.insertBefore(this.onDrag._closestItem);
				}

				this.$items = $().add(this.$items.add(this.$insertion));
				this.showingInsertion = true;

				if (this.addToTabGrid)
				{
					this.designer.tabGrid.addItems(this.$insertion);
				}
				else
				{
					this.designer.tabGrid.refreshCols();
				}

				this.setMidpoints();
			}
		}

		this.base();
	},

	/**
	 * Returns the closest item to the cursor.
	 */
	getClosestItem: function()
	{
		this.getClosestItem._closestItem = null;
		this.getClosestItem._closestItemMouseDiff = null;

		for (this.getClosestItem._i = 0; this.getClosestItem._i < this.$items.length; this.getClosestItem._i++)
		{
			this.getClosestItem._$item = $(this.$items[this.getClosestItem._i]);

			// Skip the unused tabs
			if (!this.isItemInTabContainer(this.getClosestItem._$item))
			{
				continue;
			}

			this.getClosestItem._midpoint = this.getClosestItem._$item.data('midpoint');
			this.getClosestItem._mouseDiff = Garnish.getDist(this.getClosestItem._midpoint.left, this.getClosestItem._midpoint.top, this.mouseX, this.mouseY);

			if (this.getClosestItem._closestItem === null || this.getClosestItem._mouseDiff < this.getClosestItem._closestItemMouseDiff)
			{
				this.getClosestItem._closestItem = this.getClosestItem._$item[0];
				this.getClosestItem._closestItemMouseDiff = this.getClosestItem._mouseDiff;
			}
		}

		return this.getClosestItem._closestItem;
	},

	/**
	 * On Drag Stop
	 */
	onDragStop: function()
	{
		if (this.showingInsertion)
		{
			this.$insertion.replaceWith(this.$draggee);
			this.$items = $().add(this.$items.not(this.$insertion).add(this.$draggee));

			if (this.addToTabGrid)
			{
				this.designer.tabGrid.removeItems(this.$insertion);
				this.designer.tabGrid.addItems(this.$draggee);
			}
		}

		// Drop the caboose
		this.$items = this.$items.not(this.$caboose);
		this.$caboose.remove();

		if (this.addToTabGrid)
		{
			this.designer.tabGrid.removeItems(this.$caboose);
		}

		// "show" the drag items, but make them invisible
		this.$draggee.css({
			display:    this.draggeeDisplay,
			visibility: 'hidden'
		});

		this.designer.tabGrid.refreshCols();
		this.designer.unusedFieldGrid.refreshCols();

		// return the helpers to the draggees
		this.returnHelpersToDraggees();

		this.base();
	}
});


Craft.FieldLayoutDesigner.TabDrag = Craft.FieldLayoutDesigner.BaseDrag.extend({

	itemSelector: '> div.fld-tab',
	addToTabGrid: true,

	/**
	 * Constructor
	 */
	init: function(designer)
	{
		var settings = {
			handle: '.tab'
		};

		this.base(designer, settings);
	},

	/**
	 * Append the caboose
	 */
	addCaboose: function()
	{
		this.$caboose = $('<div class="fld-tab fld-tab-caboose"/>').appendTo(this.designer.$tabContainer);
	},

	/**
	 * Returns the insertion
	 */
	getInsertion: function()
	{
		var $tab = this.$draggee.find('.tab');

		return $('<div class="fld-tab fld-insertion" style="height: '+this.$draggee.height()+'px;">' +
					'<div class="tabs"><div class="tab sel draggable" style="width: '+$tab.width()+'px; height: '+$tab.height()+'px;"></div></div>' +
					'<div class="fld-tabcontent" style="height: '+this.$draggee.find('.fld-tabcontent').height()+'px;"></div>' +
				'</div>');
	},

	/**
	 * Returns the item's container
	 */
	getItemContainer: function($item)
	{
		return $item.parent();
	},

	/**
	 * On Drag Stop
	 */
	onDragStop: function()
	{
		if (this.draggingUnusedItem && this.showingInsertion)
		{
			// Create a new tab based on that field group
			var $tab = this.$draggee.clone().removeClass('unused'),
				tabName = $tab.find('.tab span').text();

			$tab.find('.fld-field').removeClass('unused');

			// Add the edit button
			$tab.find('.tabs .tab').append('<a class="settings icon" title="'+Craft.t('Edit')+'"></a>');

			// Remove any hidden fields
			var $fields = $tab.find('.fld-field'),
				$hiddenFields = $fields.filter('.hidden').remove();

			$fields = $fields.not($hiddenFields);
			$fields.append('<a class="settings icon" title="'+Craft.t('Edit')+'"></a>');

			for (var i = 0; i < $fields.length; i++)
			{
				var $field = $($fields[i]);
				$field.append('<input class="id-input" type="hidden" name="fieldLayout['+encodeURIComponent(tabName)+'][]" value="'+$field.data('id')+'">');
			}

			this.designer.fieldDrag.addItems($fields);

			this.designer.initTab($tab);

			// Set the unused field group and its fields to hidden
			this.$draggee.css({ visibility: 'inherit', display: 'field' }).addClass('hidden');
			this.$draggee.find('.fld-field').addClass('hidden');

			// Set this.$draggee to the clone, as if we were dragging that all along
			this.$draggee = $tab;

			// Remember it for later
			this.addItems($tab);

			// Update the grids
			this.designer.tabGrid.addItems($tab);
			this.designer.unusedFieldGrid.removeItems(this.$draggee);
		}

		this.base();
	}
});


Craft.FieldLayoutDesigner.FieldDrag = Craft.FieldLayoutDesigner.BaseDrag.extend({

	itemSelector: '> div.fld-tab .fld-field',

	/**
	 * Append the caboose
	 */
	addCaboose: function()
	{
		this.$caboose = $();

		var $fieldContainers = this.designer.$tabContainer.children().children('.fld-tabcontent');

		for (var i = 0; i < $fieldContainers.length; i++)
		{
			var $caboose = $('<div class="fld-tab fld-tab-caboose"/>').appendTo($fieldContainers[i]);
			this.$caboose = this.$caboose.add($caboose);
		}
	},

	/**
	 * Returns the insertion
	 */
	getInsertion: function()
	{
		return $('<div class="fld-field fld-insertion" style="height: '+this.$draggee.height()+'px;"/>');
	},

	/**
	 * Returns the item's container
	 */
	getItemContainer: function($item)
	{
		return $item.parent().parent().parent();
	},

	/**
	 * On Drag Stop
	 */
	onDragStop: function()
	{
		if (this.draggingUnusedItem && this.showingInsertion)
		{
			// Create a new field based on that one
			var $field = this.$draggee.clone().removeClass('unused');
			$field.append('<a class="settings icon" title="'+Craft.t('Edit')+'"></a>');
			this.designer.initField($field);

			// Hide the unused field
			this.$draggee.css({ visibility: 'inherit', display: 'field' }).addClass('hidden');

			// Hide the group too?
			if (this.$draggee.siblings(':not(.hidden)').length == 0)
			{
				var $group = this.$draggee.parent().parent();
				$group.addClass('hidden');
				this.designer.unusedFieldGrid.removeItems($group);
			}

			// Set this.$draggee to the clone, as if we were dragging that all along
			this.$draggee = $field;

			// Remember it for later
			this.addItems($field);
		}

		if (this.showingInsertion)
		{
			// Find the field's new tab name
			var tabName = this.$insertion.parent().parent().find('.tab span').text(),
				inputName = 'fieldLayout['+encodeURIComponent(tabName)+'][]';

			if (this.draggingUnusedItem)
			{
				this.$draggee.append('<input class="id-input" type="hidden" name="'+inputName+'" value="'+this.$draggee.data('id')+'">');
			}
			else
			{
				this.$draggee.find('.id-input').attr('name', inputName);
			}
		}

		this.base();
	}
});


/**
 * FieldToggle
 */
Craft.FieldToggle = Garnish.Base.extend({

	$toggle: null,
	reverse: null,
	targetPrefix: null,

	_$target: null,
	type: null,

	init: function(toggle)
	{
		this.$toggle = $(toggle);

		// Is this already a field toggle?
		if (this.$toggle.data('fieldtoggle'))
		{
			Garnish.log('Double-instantiating a field toggle on an element');
			this.$toggle.data('fieldtoggle').destroy();
		}

		this.$toggle.data('fieldtoggle', this);

		this.type = this.getType();
		this.reverse = !!this.$toggle.attr('data-reverse-toggle');

		if (this.type == 'select')
		{
			this.targetPrefix = (this.$toggle.attr('data-target-prefix') || '');
			this.findTarget();
		}

		if (this.type == 'link')
		{
			this.addListener(this.$toggle, 'click', 'onToggleChange');
		}
		else
		{
			this.addListener(this.$toggle, 'change', 'onToggleChange');
		}
	},

	getType: function()
	{
		if (this.$toggle.prop('nodeName') == 'INPUT' && this.$toggle.attr('type').toLowerCase() == 'checkbox')
		{
			return 'checkbox';
		}
		else if (this.$toggle.prop('nodeName') == 'SELECT')
		{
			return 'select';
		}
		else if (this.$toggle.prop('nodeName') == 'A')
		{
			return 'link';
		}
	},

	getTarget: function()
	{
		if (!this._$target)
		{
			this.findTarget();
		}

		return this._$target;
	},

	findTarget: function()
	{
		if (this.type == 'select')
		{
			this._$target = $('#'+this.targetPrefix+this.getToggleVal());
		}
		else
		{
			this._$target = $('#'+this.$toggle.attr('data-target'));
		}
	},

	getToggleVal: function()
	{
		return Garnish.getInputPostVal(this.$toggle);
	},

	onToggleChange: function()
	{
		if (this.type == 'select')
		{
			this.hideTarget();
			this.findTarget();
			this.showTarget();
		}
		else
		{
			if (this.type == 'link')
			{
				var show = this.$toggle.hasClass('collapsed');
			}
			else
			{
				var show = !!this.getToggleVal();
			}

			if (this.reverse)
			{
				show = !show;
			}

			if (show)
			{
				this.showTarget();
			}
			else
			{
				this.hideTarget();
			}
		}
	},

	showTarget: function()
	{
		if (this.getTarget().length)
		{
			this.getTarget().removeClass('hidden');

			if (this.type != 'select')
			{
				if (this.type == 'link')
				{
					this.$toggle.removeClass('collapsed');
					this.$toggle.addClass('expanded');
				}

				var $target = this.getTarget();
				$target.height('auto');
				var height = $target.height();
				$target.height(0);
				$target.stop().animate({height: height}, 'fast', $.proxy(function() {
					$target.height('auto');
				}, this));
			}
		}
	},

	hideTarget: function()
	{
		if (this.getTarget().length)
		{
			if (this.type == 'select')
			{
				this.getTarget().addClass('hidden');
			}
			else
			{
				if (this.type == 'link')
				{
					this.$toggle.removeClass('expanded');
					this.$toggle.addClass('collapsed');
				}

				this.getTarget().stop().animate({height: 0}, 'fast', $.proxy(function() {
					this.getTarget().addClass('hidden');
				}, this));
			}
		}
	}
});


Craft.Grid = Garnish.Base.extend({

	$container: null,

	$items: null,
	items: null,
	totalCols: null,
	cols: null,
	colWidth: null,

	init: function(container, settings)
	{
		this.$container = $(container);

		this.setSettings(settings, Craft.Grid.defaults);

		this.$items = this.$container.children(this.settings.itemSelector);

		this.setCols();

		// Adjust them when the window resizes
		this.addListener(Garnish.$win, 'resize', 'setCols');
	},

	addItems: function(items)
	{
		this.$items = $().add(this.$items.add(items));
		this.refreshCols();
	},

	removeItems: function(items)
	{
		this.$items = $().add(this.$items.not(items));
		this.refreshCols();
	},

	setCols: function()
	{
		var totalCols = Math.floor(this.$container.width() / this.settings.minColWidth);

		if (totalCols == 0)
		{
			totalCols = 1;
		}

		if (totalCols !== this.totalCols)
		{
			this.totalCols = totalCols;
			this.refreshCols();
			this.stretchColHeights();
			return true;
		}

		return false;
	},

	refreshCols: function()
	{
		if (this.settings.fillMode == 'grid')
		{
			var itemIndex = 0;

			while (itemIndex < this.$items.length)
			{
				// Append the next X items and figure out which one is the tallest
				var tallestItemHeight = -1,
					colIndex = 0;

				for (var i = itemIndex; (i < itemIndex + this.totalCols && i < this.$items.length); i++)
				{
					var itemHeight = $(this.$items[i]).height('auto').height();
					if (itemHeight > tallestItemHeight)
					{
						tallestItemHeight = itemHeight;
					}

					colIndex++;
				}

				if (this.settings.snapToGrid)
				{
					var remainder = tallestItemHeight % this.settings.snapToGrid;

					if (remainder)
					{
						tallestItemHeight += this.settings.snapToGrid - remainder;
					}
				}

				// Now set their heights to the tallest one
				for (var i = itemIndex; (i < itemIndex + this.totalCols && i < this.$items.length); i++)
				{
					$(this.$items[i]).height(tallestItemHeight);
				}

				// set the itemIndex pointer to the next one up
				itemIndex += this.totalCols;
			}
		}
		else
		{
			// Detach the items before we remove the columns so they keep their events
			for (var i = 0; i < this.$items.length; i++)
			{
				$(this.$items[i]).detach();
			}

			// Delete the old columns
			if (this.cols)
			{
				for (var i = 0; i < this.cols.length; i++)
				{
					this.cols[i].remove();
				}
			}

			// Create the new columns
			this.cols = [];

			if (this.settings.percentageWidths)
			{
				this.colWidth = Math.floor(100 / this.totalCols) + '%';
			}
			else
			{
				this.colWidth = this.settings.minColWidth + 'px';
			}

			var actualTotalCols = Math.min(this.totalCols, this.$items.length);
			for (var i = 0; i < actualTotalCols; i++)
			{
				this.cols[i] = new Craft.Grid.Col(this, i);
			}

			// Place the items
			if (this.cols.length == 1)
			{
				for (var i = 0; i < this.$items.length; i++)
				{
					this.cols[0].append(this.$items[i]);

					if (this.settings.snapToGrid)
					{
						var height = $(this.$items[i]).height('auto').height(),
							remainder = height % this.settings.snapToGrid;

						if (remainder)
						{
							$(this.$items[i]).height(height + this.settings.snapToGrid - remainder);
						}
					}
				}
			}
			else
			{
				switch (this.settings.fillMode)
				{
					case 'top':
					{
						// Add each item one at a time to the shortest column
						for (var i = 0; i < this.$items.length; i++)
						{
							this.getShortestCol().append(this.$items[i]);
						}

						break;
					}
					case 'ltr':
					{
						// First get the total height of the items
						this.itemHeights = [];
						this.ltrScenarios = [];
						this.totalItemHeight = 0;

						for (var i = 0; i < this.$items.length; i++)
						{
							this.cols[0].append(this.$items[i]);
							this.itemHeights[i] = $(this.$items[i]).height();
							this.totalItemHeight += this.itemHeights[i];
							$(this.$items[i]).detach();
						}

						this.avgColHeight = this.totalItemHeight / this.cols.length;

						// Get all the possible scenarios
						this.ltrScenarios.push(
							new Craft.Grid.LtrScenario(this, 0, 0, [[]], 0)
						);

						// Find the scenario with the shortest tallest column
						var shortestScenario = this.ltrScenarios[0];

						for (var i = 1; i < this.ltrScenarios.length; i++)
						{
							if (this.ltrScenarios[i].tallestColHeight < shortestScenario.tallestColHeight)
							{
								shortestScenario = this.ltrScenarios[i];
							}
						}

						// Lay out the items
						for (var i = 0; i < shortestScenario.placements.length; i++)
						{
							for (var j = 0; j < shortestScenario.placements[i].length; j++)
							{
								this.cols[i].append(this.$items[shortestScenario.placements[i][j]]);
							}
						}

						break;
					}
				}
			}
		}
	},

	getShortestCol: function()
	{
		var shortestCol, shortestColHeight;

		for (var i = 0; i < this.cols.length; i++)
		{
			var col = this.cols[i],
				colHeight = this.cols[i].height();

			if (typeof shortestCol == 'undefined' || colHeight < shortestColHeight)
			{
				shortestCol = col;
				shortestColHeight = colHeight;
			}
		}

		return shortestCol;
	},

	getTallestCol: function()
	{
		var tallestCol, tallestColHeight;

		for (var i = 0; i < this.cols.length; i++)
		{
			var col = this.cols[i],
				colHeight = this.cols[i].height();

			if (typeof tallestCol == 'undefined' || colHeight > tallestColHeight)
			{
				tallestCol = col;
				tallestColHeight = colHeight;
			}
		}

		return tallestCol;
	},

	stretchColHeights: function()
	{
		return;
		var minHeight = Garnish.$win.height() - 101,
			tallestCol = this.getTallestCol(),
			height = Math.max(minHeight, tallestCol.height());

		for (var i = 0; i < this.cols.length; i++)
		{
			this.cols[i].height(height);
		}
	}
},
{
	defaults: {
		itemSelector: ':visible',
		minColWidth: 325,
		percentageWidths: true,
		fillMode: 'grid',
		snapToGrid: null
	}
});


Craft.Grid.Col = Garnish.Base.extend({

	grid: null,
	index: null,

	$outerContainer: null,
	$innerContainer: null,

	init: function(grid, index)
	{
		this.grid = grid;
		this.index = index;

		this.$outerContainer = $('<div class="col" style="width: '+this.grid.colWidth+'"/>').appendTo(this.grid.$container);
		this.$innerContainer = $('<div class="col-inner">').appendTo(this.$outerContainer);
	},

	height: function(height)
	{
		if (typeof height != 'undefined')
		{
			this.$innerContainer.height(height);
		}
		else
		{
			this.$innerContainer.height('auto');
			return this.$outerContainer.height();
		}
	},

	append: function(item)
	{
		this.$innerContainer.append(item);
	},

	remove: function()
	{
		this.$outerContainer.remove();
	}

});


Craft.Grid.LtrScenario = Garnish.Base.extend({

	placements: null,
	tallestColHeight: null,

	init: function(grid, itemIndex, colIndex, placements, tallestColHeight)
	{
		this.placements = placements;
		this.tallestColHeight = tallestColHeight;

		var runningColHeight = 0;

		for (itemIndex; itemIndex < grid.$items.length; itemIndex++)
		{
			var hypotheticalColHeight = runningColHeight + grid.itemHeights[itemIndex];

			// If there's enough room for this item, add it and move on
			if (hypotheticalColHeight <= grid.avgColHeight || colIndex == grid.cols.length-1)
			{
				this.placements[colIndex].push(itemIndex);
				runningColHeight += grid.itemHeights[itemIndex];
				this.checkColHeight(hypotheticalColHeight);
			}
			else
			{
				this.placements[colIndex+1] = [];

				// Create an alternate scenario where the item stays in this column
				var altPlacements = $.extend(true, [], this.placements);
				altPlacements[colIndex].push(itemIndex);
				var altTallestColHeight = Math.max(this.tallestColHeight, hypotheticalColHeight);
				grid.ltrScenarios.push(
					new Craft.Grid.LtrScenario(grid, itemIndex+1, colIndex+1, altPlacements, altTallestColHeight)
				);

				// As for this scenario, move it to the next column
				colIndex++;
				this.placements[colIndex].push(itemIndex);
				this.checkColHeight(grid.itemHeights[itemIndex]);
				runningColHeight = grid.itemHeights[itemIndex];
			}
		}
	},

	checkColHeight: function(colHeight)
	{
		if (colHeight > this.tallestColHeight)
		{
			this.tallestColHeight = colHeight;
		}
	}

});


/**
 * Handle Generator
 */
Craft.HandleGenerator = Craft.BaseInputGenerator.extend({

	generateTargetValue: function(sourceVal)
	{
		// Remove HTML tags
		var handle = sourceVal.replace("/<(.*?)>/g", '');

		// Make it lowercase
		handle = handle.toLowerCase();

		// Convert extended ASCII characters to basic ASCII
		handle = Craft.asciiString(handle);

		// Handle must start with a letter
		handle = handle.replace(/^[^a-z]+/, '');

		// Get the "words"
		var words = Craft.filterArray(handle.split(/[^a-z0-9]+/)),
			handle = '';

		// Make it camelCase
		for (var i = 0; i < words.length; i++)
		{
			if (i == 0)
			{
				handle += words[i];
			}
			else
			{
				handle += words[i].charAt(0).toUpperCase()+words[i].substr(1);
			}
		}

		return handle;
	}
});


/**
 * postParameters    - an object of POST data to pass along with each Ajax request
 * modalClass        - class to add to the modal window to allow customization
 * uploadButton      - jQuery object of the element that should open the file chooser
 * uploadAction      - upload to this location (in form of "controller/action")
 * deleteButton      - jQuery object of the element that starts the image deletion process
 * deleteMessage     - confirmation message presented to the user for image deletion
 * deleteAction      - delete image at this location (in form of "controller/action")
 * cropAction        - crop image at this (in form of "controller/action")
 * areaToolOptions   - object with some options for the area tool selector
 *   aspectRatio     - aspect ration to enforce in form of "width:height". If empty, then select area is freeform
 *   intialRectangle - object with options for the initial rectangle
 *     mode          - if set to auto, then the part selected will be the maximum size in the middle of image
 *     x1            - top left x coordinate of th rectangle, if the mode is not set to auto
 *     x2            - bottom right x coordinate of th rectangle, if the mode is not set to auto
 *     y1            - top left y coordinate of th rectangle, if the mode is not set to auto
 *     y2            - bottom right y coordinate of th rectangle, if the mode is not set to auto
 *
 * onImageDelete     - callback to call when image is deleted. First parameter will containt respone data.
 * onImageSave       - callback to call when an cropped image is saved. First parameter will contain response data.
 */


/**
 * Image Upload tool.
 */
Craft.ImageUpload = Garnish.Base.extend({

	_imageHandler: null,

	init: function(settings)
	{
		this.setSettings(settings, Craft.ImageUpload.defaults);
		this._imageHandler = new Craft.ImageHandler(settings);
	}
},
{
	$modalContainerDiv: null,

	defaults: {
		postParameters: {},

		modalClass: "",
		uploadButton: {},
		uploadAction: "",

		deleteButton: {},
		deleteMessage: "",
		deleteAction: "",

		cropAction:"",

		areaToolOptions:
		{
			aspectRatio: "1:1",
			initialRectangle: {
				mode: "auto",
				x1: 0,
				x2: 0,
				y1: 0,
				y2: 0
			}
		},

		onImageDelete: function(response)
		{
			location.reload();
		},
		onImageSave: function(response)
		{
			location.reload();
		}
	}
});


Craft.ImageHandler = Garnish.Base.extend({

	modal: null,

	init: function(settings)
	{
		this.setSettings(settings);

		var _this = this;

		var element = settings.uploadButton;
		var options = {
			element:    this.settings.uploadButton[0],
			action:     Craft.actionUrl + '/' + this.settings.uploadAction,
			params:     this.settings.postParameters,
			multiple:   false,
			onComplete: function(fileId, fileName, response)
			{

				if (Craft.ImageUpload.$modalContainerDiv == null)
				{
					Craft.ImageUpload.$modalContainerDiv = $('<div class="modal"></div>').addClass(settings.modalClass).appendTo(Garnish.$bod);
				}

				if (response.html)
				{
					Craft.ImageUpload.$modalContainerDiv.empty().append(response.html);
					if (!this.modal)
					{
						this.modal = new Craft.ImageModal({postParameters: settings.postParameters, cropAction: settings.cropAction});
						this.modal.setContainer(Craft.ImageUpload.$modalContainerDiv);
						this.modal.imageHandler = _this;
					}

					var modal = this.modal;

					modal.bindButtons();
					modal.addListener(modal.$saveBtn, 'click', 'saveImage');
					modal.addListener(modal.$cancelBtn, 'click', 'cancel');

					modal.show();
					modal.removeListener(Garnish.Modal.$shade, 'click');

					setTimeout(function()
					{
						Craft.ImageUpload.$modalContainerDiv.find('img').load(function()
						{
							var profileTool = new Craft.ImageAreaTool(settings.areaToolOptions);
							profileTool.showArea(modal);
						});
					}, 1);
				}
			},
			allowedExtensions: ['jpg', 'jpeg', 'gif', 'png'],
			template: '<div class="QqUploader-uploader"><div class="QqUploader-upload-drop-area" style="display: none; "><span></span></div><div class="QqUploader-upload-button" style="position: relative; overflow: hidden; direction: ltr; ">' +
				element.text() +
				'<input type="file" name="file" style="position: absolute; right: 0px; top: 0px; font-family: Arial; font-size: 118px; margin: 0px; padding: 0px; cursor: pointer; opacity: 0; "></div><ul class="QqUploader-upload-list"></ul></div>'

		};

		options.sizeLimit = Craft.maxUploadSize;

		this.uploader = new qqUploader.FileUploader(options);

		$(settings.deleteButton).click(function()
		{
			if (confirm(settings.deleteMessage))
			{
				$(this).parent().append('<div class="blocking-modal"></div>');
				Craft.postActionRequest(settings.deleteAction, settings.postParameters, $.proxy(function(response){
					_this.onImageDelete.apply(_this, [response]);
				}, this));

			}
		});
	},

	onImageSave: function(data)
	{
		this.settings.onImageSave.apply(this, [data]);
	},

	onImageDelete: function(data)
	{
		this.settings.onImageDelete.apply(this, [data]);
	}
});


Craft.ImageModal = Garnish.Modal.extend({

	$container: null,
	$saveBtn: null,
	$cancelBtn: null,

	areaSelect: null,
	factor: null,
	source: null,
	_postParameters: null,
	_cropAction: "",
	imageHandler: null,


	init: function(settings)
	{
		this.base();
		this._postParameters = settings.postParameters;
		this._cropAction = settings.cropAction;
	},

	bindButtons: function()
	{
		this.$saveBtn = this.$container.find('.submit:first');
		this.$cancelBtn = this.$container.find('.cancel:first');
	},

	cancel: function()
	{
		this.hide();
		this.areaSelect.setOptions({remove: true, hide: true, disable: true});
		this.$container.empty();
	},

	saveImage: function()
	{

		var selection = this.areaSelect.getSelection();
		var params = {
			x1: Math.round(selection.x1 / this.factor),
			x2: Math.round(selection.x2 / this.factor),
			y1: Math.round(selection.y1 / this.factor),
			y2: Math.round(selection.y2 / this.factor),
			source: this.source
		};

		params = $.extend(this._postParameters, params);

		Craft.postActionRequest(this._cropAction, params, $.proxy(function(response)
		{

			if (response.error)
			{
				alert(response.error);
			}
			else
			{
				this.imageHandler.onImageSave.apply(this.imageHandler, [response]);
			}

			this.hide();
			this.$container.empty();
			this.areaSelect.setOptions({remove: true, hide: true, disable: true});


		}, this));

		this.areaSelect.setOptions({disable: true});
		this.removeListener(this.$saveBtn, 'click');
		this.removeListener(this.$cancelBtn, 'click');

		this.$container.find('.crop-image').fadeTo(50, 0.5);
	}

});


Craft.ImageAreaTool = Garnish.Base.extend({

	$container: null,

	init: function(settings)
	{
		this.$container = Craft.ImageUpload.$modalContainerDiv;
		this.setSettings(settings);
	},

	showArea: function(referenceObject)
	{
		var $target = this.$container.find('img');


		var areaOptions = {
			aspectRatio: this.settings.aspectRatio,
			maxWidth: $target.width(),
			maxHeight: $target.height(),
			instance: true,
			resizable: true,
			show: true,
			persistent: true,
			handles: true,
			parent: $target.parent()
		};

		var areaSelect = $target.imgAreaSelect(areaOptions);

		var x1 = this.settings.initialRectangle.x1;
		var x2 = this.settings.initialRectangle.x2;
		var y1 = this.settings.initialRectangle.y1;
		var y2 = this.settings.initialRectangle.y2;

		if (this.settings.initialRectangle.mode == "auto")
		{
			var proportions = this.settings.aspectRatio.split(":");
			var rectangleWidth = 0;
			var rectangleHeight = 0;


			// [0] - width proportion, [1] - height proportion
			if (proportions[0] > proportions[1])
			{
				rectangleWidth = $target.width();
				rectangleHeight = rectangleWidth * proportions[1] / proportions[0];
			} else if (proportions[0] > proportions[1])
			{
				rectangleHeight = $target.height();
				rectangleWidth = rectangleHeight * proportions[0] / proportions[1];
			} else {
				rectangleHeight = rectangleWidth = Math.min($target.width(), $target.height());
			}
			x1 = Math.round(($target.width() - rectangleWidth) / 2);
			y1 = Math.round(($target.height() - rectangleHeight) / 2);
			x2 = x1 + rectangleWidth;
			y2 = y1 + rectangleHeight;

		}
		areaSelect.setSelection(x1, y1, x2, y2);
		areaSelect.update();

		referenceObject.areaSelect = areaSelect;
		referenceObject.factor = $target.attr('data-factor');
		referenceObject.source = $target.attr('src').split('/').pop();
	}
});


/**
 * Light Switch
 */
Craft.LightSwitch = Garnish.Base.extend({

	settings: null,
	$outerContainer: null,
	$innerContainer: null,
	$input: null,
	$toggleTarget: null,
	on: null,
	dragger: null,

	dragStartMargin: null,

	init: function(outerContainer, settings)
	{
		this.$outerContainer = $(outerContainer);

		// Is this already a switch?
		if (this.$outerContainer.data('lightswitch'))
		{
			Garnish.log('Double-instantiating a switch on an element');
			this.$outerContainer.data('lightswitch').destroy();
		}

		this.$outerContainer.data('lightswitch', this);

		this.setSettings(settings, Craft.LightSwitch.defaults);

		this.$innerContainer = this.$outerContainer.find('.container:first');
		this.$input = this.$outerContainer.find('input:first');
		this.$toggleTarget = $(this.$outerContainer.attr('data-toggle'));

		this.on = this.$outerContainer.hasClass('on');

		this.addListener(this.$outerContainer, 'mousedown', '_onMouseDown');
		this.addListener(this.$outerContainer, 'keydown', '_onKeyDown');

		this.dragger = new Garnish.BaseDrag(this.$outerContainer, {
			axis:          Garnish.X_AXIS,
			ignoreButtons: false,
			onDragStart:   $.proxy(this, '_onDragStart'),
			onDrag:        $.proxy(this, '_onDrag'),
			onDragStop:    $.proxy(this, '_onDragStop')
		});
	},

	turnOn: function()
	{
		this.$innerContainer.stop().animate({marginLeft: 0}, 'fast');
		this.$input.val('y');
		this.on = true;
		this.settings.onChange();

		this.$toggleTarget.show();
		this.$toggleTarget.height('auto');
		var height = this.$toggleTarget.height();
		this.$toggleTarget.height(0);
		this.$toggleTarget.stop().animate({height: height}, 'fast', $.proxy(function() {
			this.$toggleTarget.height('auto');
		}, this));
	},

	turnOff: function()
	{
		this.$innerContainer.stop().animate({marginLeft: Craft.LightSwitch.offMargin}, 'fast');
		this.$input.val('');
		this.on = false;
		this.settings.onChange();

		this.$toggleTarget.stop().animate({height: 0}, 'fast');
	},

	toggle: function(event)
	{
		if (!this.on)
			this.turnOn();
		else
			this.turnOff();
	},

	_onMouseDown: function()
	{
		this.addListener(Garnish.$doc, 'mouseup', '_onMouseUp')
	},

	_onMouseUp: function()
	{
		this.removeListener(Garnish.$doc, 'mouseup');

		// Was this a click?
		if (!this.dragger.dragging)
			this.toggle();
	},

	_onKeyDown: function(event)
	{
		switch (event.keyCode)
		{
			case Garnish.SPACE_KEY:
				this.toggle();
				event.preventDefault();
				break;
			case Garnish.RIGHT_KEY:
				this.turnOn();
				event.preventDefault();
				break;
			case Garnish.LEFT_KEY:
				this.turnOff();
				event.preventDefault();
				break;
		}
	},

	_getMargin: function()
	{
		return parseInt(this.$innerContainer.css('marginLeft'))
	},

	_onDragStart: function()
	{
		this.dragStartMargin = this._getMargin();
	},

	_onDrag: function()
	{
		var margin = this.dragStartMargin + this.dragger.mouseDistX;

		if (margin < Craft.LightSwitch.offMargin)
			margin = Craft.LightSwitch.offMargin;
		else if (margin > 0)
			margin = 0;

		this.$innerContainer.css('marginLeft', margin);
	},

	_onDragStop: function()
	{
		var margin = this._getMargin();

		if (margin > -16)
			this.turnOn();
		else
			this.turnOff();
	},

	destroy: function()
	{
		this.base();
		this.dragger.destroy();
	}

}, {
	offMargin: -50,
	defaults: {
		onChange: function(){}
	}
});


/**
 * Links Field
 */
Craft.LinksField = Garnish.Base.extend({

	_$inputContainer: null,
	_$inputTbody: null,
	_$fillerRows: null,
	_$showModalBtn: null,
	_$removeLinksBtn: null,

	_$modalBody: null,
	_$modalTbody: null,
	_$cancelBtn: null,
	_$selectBtn: null,

	_id: null,
	_name: null,
	_settings: null,
	_selectedIds: null,
	_minSlots: null,
	_modal: null,
	_inputSelect: null,
	_modalSelect: null,
	_inputSort: null,

	init: function(id, name, settings, selectedIds)
	{
		this._id = id;
		this._name = name;
		this._settings = settings;
		this._selectedIds = selectedIds;

		this._$inputContainer = $('#'+this._id);

		// Find the field buttons
		var $buttons = this._$inputContainer.next();
		this._$showModalBtn = $buttons.find('.btn.add');
		this._$removeLinksBtn = $buttons.find('.btn.remove');

		// Find the preselected elements
		var $table = this._$inputContainer.children('table');
		this._$inputTbody = $table.children('tbody');
		var $rows = this._$inputTbody.children(':not(.filler)');
		var $elements = $rows.find('div.element');

		this._inputSelect = new Garnish.Select(this._$inputContainer, $elements, {
			multi: true,
			filter: ':not(.edit)',
			onSelectionChange: $.proxy(function() {
				if (this._inputSelect.totalSelected)
				{
					this._$removeLinksBtn.enable();
				}
				else
				{
					this._$removeLinksBtn.disable();
				}
			}, this)
		});

		this._inputSort = new Craft.DataTableSorter($table, {
			handle: '.element',
			filter: $.proxy(function() {
				return this._inputSelect.getSelectedItems().closest('tr');
			}, this),
			onSortChange: $.proxy(function() {
				this._inputSelect.resetItemOrder();
			}, this)
		});

		// Find any filler rows
		this._minSlots = settings.limit ? Math.min(3, settings.limit) : 3;
		this._$fillerRows = this._$inputTbody.children('.filler');

		this.addListener(this._$showModalBtn, 'activate', '_showModal');
		this.addListener(this._$removeLinksBtn, 'activate', '_removeSelectedElements');
	},

	_buildModal: function()
	{
		var $modal = $('<div class="addlinksmodal modal"/>').appendTo(Garnish.$bod),
			$header = $('<header class="header"><h1>'+this._settings.addLabel+'</h1></header>').appendTo($modal);

		this._$modalBody = $('<div class="body"/>').appendTo($modal);

		var $footer = $('<footer class="footer"/>').appendTo($modal),
			$rightList = $('<ul class="right"/>').appendTo($footer),
			$cancelBtnContainer = $('<li/>').appendTo($rightList),
			$selectBtnContainer = $('<li/>').appendTo($rightList);

		this._$cancelBtn = $('<div class="btn">'+Craft.t('Cancel')+'</div>').appendTo($cancelBtnContainer);
		this._$selectBtn = $('<div class="btn submit disabled">'+this._settings.addLabel+'</div>').appendTo($selectBtnContainer);

		this._modal = new Garnish.Modal($modal);

		this._updateModal();

		this.addListener(this._$cancelBtn, 'activate', '_hideModal');
		this.addListener(this._$selectBtn, 'activate', '_selectElements');
	},

	_showModal: function()
	{
		if (!this._modal)
		{
			this._buildModal();
		}
		else
		{
			this._inputSelect.deselectAll();
			this._modalSelect.deselectAll();
			this._modal.show();

			setTimeout($.proxy(function() {
				this._$modalBody.focus();
			}, this), 50);
		}
	},

	_hideModal: function()
	{
		this._modal.hide();
		this._$inputContainer.focus();
	},

	_updateModal: function()
	{
		var data = {
			type: this._settings.type,
			name: this._name,
			settings: JSON.stringify(this._settings.elementTypeSettings),
			selectedIds: JSON.stringify(this._selectedIds)
		};

		Craft.postActionRequest('links/getModalBody', data, $.proxy(function(response) {
			this._$modalBody.html(response);

			this._$modalTbody = this._$modalBody.find('tbody:first');
			var $elements = this._$modalTbody.children(':not(.hidden)').find('.element');

			this._modalSelect = new Garnish.Select(this._$modalBody, $elements, {
				multi: true,
				waitForDblClick: true,
				filter: ':not(.edit)',
				onSelectionChange: $.proxy(function() {
					if (this._modalSelect.totalSelected)
					{
						this._$selectBtn.enable();
					}
					else
					{
						this._$selectBtn.disable();
					}
				}, this)
			});

			this.addListener(this._$modalBody, 'dblclick', '_selectElements');
		}, this));
	},

	_selectElements: function()
	{
		if (!this._modalSelect.totalSelected)
		{
			return;
		}

		var $elements = this._modalSelect.getSelectedItems();
		this._modalSelect.removeItems($elements);

		// Delete extra filler rows
		var count = Math.min($elements.length, this._$fillerRows.length);
		this._$fillerRows.slice(0, count).remove();
		this._$fillerRows = this._$fillerRows.slice(count);

		// Clone the rows and add them to the field
		var $rows = $elements.closest('tr'),
			$clonedRows = $rows.clone();

		if (this._$fillerRows.length)
		{
			$clonedRows.insertBefore(this._$fillerRows.first());
		}
		else
		{
			$clonedRows.appendTo(this._$inputTbody)
		}

		// Finish up
		this._modal.hide();
		this._$removeLinksBtn.enable();

		$elements = $clonedRows.find('.element');
		this._inputSelect.addItems($elements);
		this._inputSort.addItems($clonedRows);

		this._$inputContainer.focus();

		// Hide the original rows once the modal has faded out
		setTimeout(function() {
			$rows.addClass('hidden');
		}, 200);
	},

	_removeSelectedElements: function()
	{
		if (!this._inputSelect.totalSelected)
		{
			return;
		}

		// Find the selected links
		var $elements = this._inputSelect.getSelectedItems(),
			$rows = $elements.closest('tr');

		// Remove them
		this._inputSelect.removeItems($elements);
		this._inputSort.removeItems($rows);
		$rows.remove();

		// Add filler rows?
		var totalSelectedElements = this._inputSelect.$items.length;
		var missingFillerRows = this._minSlots - totalSelectedElements;
		for (var i = this._$fillerRows.length; i < missingFillerRows; i++)
		{
			var $fillerRow = $('<tr class="filler"><td></td></tr>').appendTo(this._$inputTbody);
			this._$fillerRows = this._$fillerRows.add($fillerRow);
		}

		// Disable the Remove Links button
		this._$removeLinksBtn.disable();

		// Show them in the modal
		if (this._modal)
		{
			var $hiddenElements = this._$modalTbody.children('.hidden').find('.element');

			for (var i = 0; i < $elements.length; i++)
			{
				var id = $($elements[i]).attr('data-id'),
					$element = $hiddenElements.filter('[data-id='+id+']:first');

				$element.closest('tr').removeClass('hidden');
				this._modalSelect.addItems($element);
			}
		}

		this._$inputContainer.focus();
	}
});


/*

 http://github.com/valums/file-uploader

 Multiple file upload component with progress-bar, drag-and-drop.

 Copyright (C) 2011 by Andris Valums

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 */

(function(){

//
// Helper functions
//

    var QqUploader = QqUploader || {};

    /**
     * Adds all missing properties from second obj to first obj
     */

    QqUploader.extend = function(first, second){
        for (var prop in second){
            first[prop] = second[prop];
        }
    };

    /**
     * Searches for a given element in the array, returns -1 if it is not present.
     * @param {Number} [from] The index at which to begin the search
     */
    QqUploader.indexOf = function(arr, elt, from){
        if (arr.indexOf) return arr.indexOf(elt, from);

        from = from || 0;
        var len = arr.length;

        if (from < 0) from += len;

        for (; from < len; from++){

            if (from in arr && arr[from] === elt){

                return from;
            }
        }

        return -1;

    };

    QqUploader.getUniqueId = (function(){
        var id = 0;
        return function(){ return id++; };
    })();

//
// Events

    QqUploader.attach = function(element, type, fn){
        if (element.addEventListener){
            element.addEventListener(type, fn, false);
        } else if (element.attachEvent){
            element.attachEvent('on' + type, fn);
        }
    };
    QqUploader.detach = function(element, type, fn){
        if (element.removeEventListener){
            element.removeEventListener(type, fn, false);
        } else if (element.attachEvent){
            element.detachEvent('on' + type, fn);
        }
    };

    QqUploader.preventDefault = function(e){
        if (e.preventDefault){
            e.preventDefault();
        } else{
            e.returnValue = false;
        }
    };

//
// Node manipulations

    /**
     * Insert node a before node b.
     */
    QqUploader.insertBefore = function(a, b){
        b.parentNode.insertBefore(a, b);
    };
    QqUploader.remove = function(element){
        element.parentNode.removeChild(element);
    };

    QqUploader.contains = function(parent, descendant){

        // compareposition returns false in this case
        if (parent == descendant) return true;

        if (parent.contains){
            return parent.contains(descendant);
        } else {
            return !!(descendant.compareDocumentPosition(parent) & 8);
        }
    };

    /**
     * Creates and returns element from html string
     * Uses innerHTML to create an element
     */
    QqUploader.toElement = (function(){
        var div = document.createElement('div');
        return function(html){
            div.innerHTML = html;
            var element = div.firstChild;
            div.removeChild(element);
            return element;
        };
    })();

//
// Node properties and attributes

    /**
     * Sets styles for an element.
     * Fixes opacity in IE6-8.
     */
    QqUploader.css = function(element, styles){
        if (styles.opacity != null){
            if (typeof element.style.opacity != 'string' && typeof(element.filters) != 'undefined'){
                styles.filter = 'alpha(opacity=' + Math.round(100 * styles.opacity) + ')';
            }
        }
        QqUploader.extend(element.style, styles);
    };
    QqUploader.hasClass = function(element, name){
        var re = new RegExp('(^| )' + name + '( |$)');
        return re.test(element.className);
    };
    QqUploader.addClass = function(element, name){
        if (!QqUploader.hasClass(element, name)){
            element.className += ' ' + name;
        }
    };
    QqUploader.removeClass = function(element, name){
        var re = new RegExp('(^| )' + name + '( |$)');
        element.className = element.className.replace(re, ' ').replace(/^\s+|\s+$/g, "");
    };
    QqUploader.setText = function(element, text){
        element.innerText = text;
        element.textContent = text;
    };

//
// Selecting elements

    QqUploader.children = function(element){
        var children = [],
            child = element.firstChild;

        while (child){
            if (child.nodeType == 1){
                children.push(child);
            }
            child = child.nextSibling;
        }

        return children;
    };

    QqUploader.getByClass = function(element, className){
        if (element.querySelectorAll){
            return element.querySelectorAll('.' + className);
        }

        var result = [];
        var candidates = element.getElementsByTagName("*");
        var len = candidates.length;

        for (var i = 0; i < len; i++){
            if (QqUploader.hasClass(candidates[i], className)){
                result.push(candidates[i]);
            }
        }
        return result;
    };

    /**
     * obj2url() takes a json-object as argument and generates
     * a querystring. pretty much like jQuery.param()
     *

     * how to use:
     *
     *    `QqUploader.obj2url({a:'b',c:'d'},'http://any.url/upload?otherParam=value');`
     *
     * will result in:
     *
     *    `http://any.url/upload?otherParam=value&a=b&c=d`
     *
     * @param  Object JSON-Object
     * @param  String current querystring-part
     * @return String encoded querystring
     */
    QqUploader.obj2url = function(obj, temp, prefixDone){
        var uristrings = [],
            prefix = '&',
            add = function(nextObj, i){
                var nextTemp = temp

                    ? (/\[\]$/.test(temp)) // prevent double-encoding
                    ? temp
                    : temp+'['+i+']'
                    : i;
                if ((nextTemp != 'undefined') && (i != 'undefined')) {

                    uristrings.push(
                        (typeof nextObj === 'object')

                            ? QqUploader.obj2url(nextObj, nextTemp, true)
                            : (Object.prototype.toString.call(nextObj) === '[object Function]')
                            ? encodeURIComponent(nextTemp) + '=' + encodeURIComponent(nextObj())
                            : encodeURIComponent(nextTemp) + '=' + encodeURIComponent(nextObj)

                    );
                }
            };

        if (!prefixDone && temp) {
            prefix = (/\?/.test(temp)) ? (/\?$/.test(temp)) ? '' : '&' : '?';
            uristrings.push(temp);
            uristrings.push(QqUploader.obj2url(obj));
        } else if ((Object.prototype.toString.call(obj) === '[object Array]') && (typeof obj != 'undefined') ) {
            // we wont use a for-in-loop on an array (performance)
            for (var i = 0, len = obj.length; i < len; ++i){
                add(obj[i], i);
            }
        } else if ((typeof obj != 'undefined') && (obj !== null) && (typeof obj === "object")){
            // for anything else but a scalar, we will use for-in-loop
            for (var i in obj){
                add(obj[i], i);
            }
        } else {
            uristrings.push(encodeURIComponent(temp) + '=' + encodeURIComponent(obj));
        }

        return uristrings.join(prefix)
            .replace(/^&/, '')
            .replace(/%20/g, '+');

    };

//
//
// Uploader Classes
//
//

    var QqUploader = QqUploader || {};

    /**
     * Creates upload button, validates upload, but doesn't create file list or dd.

     */
    QqUploader.FileUploaderBasic = function(o){
        this._options = {
            // set to true to see the server response
            debug: false,
            action: '/server/upload',
            params: {},
            button: null,
            multiple: true,
            maxConnections: 3,
            // validation

            allowedExtensions: [],

            sizeLimit: 0,

            minSizeLimit: 0,

            // events
            // return false to cancel submit
            onSubmit: function(id, fileName){},
            onProgress: function(id, fileName, loaded, total){},
            onComplete: function(id, fileName, responseJSON){},
            onCancel: function(id, fileName){},
            // messages

            messages: {
                typeError: "{file} has invalid extension. Only {extensions} are allowed.",
                sizeError: "{file} is too large, maximum file size is {sizeLimit}.",
                minSizeError: "{file} is too small, minimum file size is {minSizeLimit}.",
                emptyError: "{file} is empty, please select files again without it.",
                onLeave: "The files are being uploaded, if you leave now the upload will be cancelled."

            },
            showMessage: function(message){
                alert(message);
            }

        };
        QqUploader.extend(this._options, o);

        // number of files being uploaded
        this._filesInProgress = 0;
        this._handler = this._createUploadHandler();

        if (this._options.button){

            this._button = this._createUploadButton(this._options.button);
        }

        this._preventLeaveInProgress();

    };

    QqUploader.FileUploaderBasic.prototype = {
        setParams: function(params){
            this._options.params = params;
        },
        getInProgress: function(){
            return this._filesInProgress;

        },
        _createUploadButton: function(element){
            var self = this;

            return new QqUploader.UploadButton({
                element: element,
                multiple: this._options.multiple && QqUploader.UploadHandlerXhr.isSupported(),
                onChange: function(input){
                    self._onInputChange(input);
                }

            });

        },

        _createUploadHandler: function(){
            var self = this,
                handlerClass;

            if(QqUploader.UploadHandlerXhr.isSupported()){

                handlerClass = 'UploadHandlerXhr';

            } else {
                handlerClass = 'UploadHandlerForm';
            }

            var handler = new QqUploader[handlerClass]({
                debug: this._options.debug,
                action: this._options.action,

                maxConnections: this._options.maxConnections,

                onProgress: function(id, fileName, loaded, total){

                    self._onProgress(id, fileName, loaded, total);
                    self._options.onProgress(id, fileName, loaded, total);

                },

                onComplete: function(id, fileName, result){
                    self._onComplete(id, fileName, result);
                    self._options.onComplete(id, fileName, result);
                },
                onCancel: function(id, fileName){
                    self._onCancel(id, fileName);
                    self._options.onCancel(id, fileName);
                }
            });

            return handler;
        },

        _preventLeaveInProgress: function(){
            var self = this;

            QqUploader.attach(window, 'beforeunload', function(e){
                if (!self._filesInProgress){return;}

                var e = e || window.event;
                // for ie, ff
                e.returnValue = self._options.messages.onLeave;
                // for webkit
                return self._options.messages.onLeave;

            });

        },

        _onSubmit: function(id, fileName){
            this._filesInProgress++;

        },
        _onProgress: function(id, fileName, loaded, total){

        },
        _onComplete: function(id, fileName, result){
            this._filesInProgress--;

            if (result.error){
                this._options.showMessage(result.error);
            }

        },
        _onCancel: function(id, fileName){
            this._filesInProgress--;

        },
        _onInputChange: function(input){
            if (this._handler instanceof QqUploader.UploadHandlerXhr){

                this._uploadFileList(input.files);

            } else {

                if (this._validateFile(input)){

                    this._uploadFile(input);

                }

            }

            this._button.reset();

        },

        _uploadFileList: function(files){
            for (var i=0; i<files.length; i++){
                if ( !this._validateFile(files[i])){
                    return;
                }

            }

            for (var i=0; i<files.length; i++){
                this._uploadFile(files[i]);

            }

        },

        _uploadFile: function(fileContainer){

            var id = this._handler.add(fileContainer);
            var fileName = this._handler.getName(id);

            if (this._options.onSubmit(id, fileName) !== false){
                this._onSubmit(id, fileName);
                this._handler.upload(id, this._options.params);
            }
        },

        _validateFile: function(file){
            var name, size;

            if (file.value){
                // it is a file input

                // get input value and remove path to normalize
                name = file.value.replace(/.*(\/|\\)/, "");
            } else {
                // fix missing properties in Safari
                name = file.fileName != null ? file.fileName : file.name;
                size = file.fileSize != null ? file.fileSize : file.size;
            }

            if (! this._isAllowedExtension(name)){

                this._error('typeError', name);
                return false;

            } else if (size === 0){

                this._error('emptyError', name);
                return false;

            } else if (size && this._options.sizeLimit && size > this._options.sizeLimit){

                this._error('sizeError', name);
                return false;

            } else if (size && size < this._options.minSizeLimit){
                this._error('minSizeError', name);
                return false;

            }

            return true;

        },
        _error: function(code, fileName){
            var message = this._options.messages[code];

            function r(name, replacement){ message = message.replace(name, replacement); }

            r('{file}', this._formatFileName(fileName));

            r('{extensions}', this._options.allowedExtensions.join(', '));
            r('{sizeLimit}', this._formatSize(this._options.sizeLimit));
            r('{minSizeLimit}', this._formatSize(this._options.minSizeLimit));

            this._options.showMessage(message);

        },
        _formatFileName: function(name){
            if (name.length > 33){
                name = name.slice(0, 19) + '...' + name.slice(-13);

            }
            return name;
        },
        _isAllowedExtension: function(fileName){
            var ext = (-1 !== fileName.indexOf('.')) ? fileName.replace(/.*[.]/, '').toLowerCase() : '';
            var allowed = this._options.allowedExtensions;

            if (!allowed.length){return true;}

            for (var i=0; i<allowed.length; i++){
                if (allowed[i].toLowerCase() == ext){ return true;}

            }

            return false;
        },

        _formatSize: function(bytes){
            var i = -1;

            do {
                bytes = bytes / 1024;
                i++;

            } while (bytes > 99);

            return Math.max(bytes, 0.1).toFixed(1) + ['kB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];

        }
    };

    /**
     * Class that creates upload widget with drag-and-drop and file list
     * @inherits QqUploader.FileUploaderBasic
     */
    QqUploader.FileUploader = function(o){
        // call parent constructor
        QqUploader.FileUploaderBasic.apply(this, arguments);

        // additional options

        QqUploader.extend(this._options, {
            element: null,
            // if set, will be used instead of QqUploader-upload-list in template
            listElement: null,

            template: '<div class="QqUploader-uploader">' +

                '<div class="QqUploader-upload-drop-area"><span>Drop files here to upload</span></div>' +
                '<div class="QqUploader-upload-button">Upload a file</div>' +
                '<ul class="QqUploader-upload-list"></ul>' +

                '</div>',

            // template for one item in file list
            fileTemplate: '<li>' +
                '<span class="QqUploader-upload-file"></span>' +
                '<span class="QqUploader-upload-spinner"></span>' +
                '<span class="QqUploader-upload-size"></span>' +
                '<a class="QqUploader-upload-cancel" href="#">Cancel</a>' +
                '<span class="QqUploader-upload-failed-text">Failed</span>' +
                '</li>',

            classes: {
                // used to get elements from templates
                button: 'QqUploader-upload-button',
                drop: 'QqUploader-upload-drop-area',
                dropActive: 'QqUploader-upload-drop-area-active',
                list: 'QqUploader-upload-list',

                file: 'QqUploader-upload-file',
                spinner: 'QqUploader-upload-spinner',
                size: 'QqUploader-upload-size',
                cancel: 'QqUploader-upload-cancel',

                // added to list item when upload completes
                // used in css to hide progress spinner
                success: 'QqUploader-upload-success',
                fail: 'QqUploader-upload-fail'
            }
        });
        // overwrite options with user supplied

        QqUploader.extend(this._options, o);

        this._element = this._options.element;
        this._element.innerHTML = this._options.template;

        this._listElement = this._options.listElement || this._find(this._element, 'list');

        this._classes = this._options.classes;

        this._button = this._createUploadButton(this._find(this._element, 'button'));

        this._bindCancelEvent();
        this._setupDragDrop();
    };

// inherit from Basic Uploader
    QqUploader.extend(QqUploader.FileUploader.prototype, QqUploader.FileUploaderBasic.prototype);

    QqUploader.extend(QqUploader.FileUploader.prototype, {
        /**
         * Gets one of the elements listed in this._options.classes
         **/
        _find: function(parent, type){

            var element = QqUploader.getByClass(parent, this._options.classes[type])[0];

            if (!element){
                throw new Error('element not found: ' + type);
            }

            return element;
        },
        _setupDragDrop: function(){
            var self = this,
                dropArea = this._find(this._element, 'drop');

            var dz = new QqUploader.UploadDropZone({
                element: dropArea,
                onEnter: function(e){
                    QqUploader.addClass(dropArea, self._classes.dropActive);
                    e.stopPropagation();
                },
                onLeave: function(e){
                    e.stopPropagation();
                },
                onLeaveNotDescendants: function(e){
                    QqUploader.removeClass(dropArea, self._classes.dropActive);

                },
                onDrop: function(e){
                    dropArea.style.display = 'none';
                    QqUploader.removeClass(dropArea, self._classes.dropActive);
                    self._uploadFileList(e.dataTransfer.files);

                }
            });

            dropArea.style.display = 'none';

            QqUploader.attach(document, 'dragenter', function(e){

                if (!dz._isValidFileDrag(e)) return;

                dropArea.style.display = 'block';

            });

            QqUploader.attach(document, 'dragleave', function(e){
                if (!dz._isValidFileDrag(e)) return;

                var relatedTarget = document.elementFromPoint(e.clientX, e.clientY);
                // only fire when leaving document out
                if ( ! relatedTarget || relatedTarget.nodeName == "HTML"){

                    dropArea.style.display = 'none';

                }
            });

        },
        _onSubmit: function(id, fileName){
            QqUploader.FileUploaderBasic.prototype._onSubmit.apply(this, arguments);
            this._addToList(id, fileName);

        },
        _onProgress: function(id, fileName, loaded, total){
            QqUploader.FileUploaderBasic.prototype._onProgress.apply(this, arguments);

            var item = this._getItemByFileId(id);
            var size = this._find(item, 'size');
            size.style.display = 'inline';

            var text;

            if (loaded != total){
                text = Math.round(loaded / total * 100) + '% from ' + this._formatSize(total);
            } else {

                text = this._formatSize(total);
            }

            QqUploader.setText(size, text);

        },
        _onComplete: function(id, fileName, result){
            QqUploader.FileUploaderBasic.prototype._onComplete.apply(this, arguments);

            // mark completed
            var item = this._getItemByFileId(id);

            QqUploader.remove(this._find(item, 'cancel'));
            QqUploader.remove(this._find(item, 'spinner'));

            if (result.success){
                QqUploader.addClass(item, this._classes.success);

            } else {
                QqUploader.addClass(item, this._classes.fail);
            }

        },
        _addToList: function(id, fileName){
            var item = QqUploader.toElement(this._options.fileTemplate);

            item.qqfileId = id;

            var fileElement = this._find(item, 'file');

            QqUploader.setText(fileElement, this._formatFileName(fileName));
            this._find(item, 'size').style.display = 'none';

            this._listElement.appendChild(item);
        },
        _getItemByFileId: function(id){
            var item = this._listElement.firstChild;

            // there can't be txt nodes in dynamically created list
            // and we can  use nextSibling
            while (item){

                if (item.qqfileId == id) return item;

                item = item.nextSibling;
            }

        },
        /**
         * delegate click event for cancel link

         **/
        _bindCancelEvent: function(){
            var self = this,
                list = this._listElement;

            QqUploader.attach(list, 'click', function(e){

                e = e || window.event;
                var target = e.target || e.srcElement;

                if (QqUploader.hasClass(target, self._classes.cancel)){

                    QqUploader.preventDefault(e);

                    var item = target.parentNode;
                    self._handler.cancel(item.qqfileId);
                    QqUploader.remove(item);
                }
            });
        }

    });

    QqUploader.UploadDropZone = function(o){
        this._options = {
            element: null,

            onEnter: function(e){},
            onLeave: function(e){},

            // is not fired when leaving element by hovering descendants

            onLeaveNotDescendants: function(e){},

            onDrop: function(e){}

        };
        QqUploader.extend(this._options, o);

        this._element = this._options.element;

        this._disableDropOutside();
        this._attachEvents();

    };

    QqUploader.UploadDropZone.prototype = {
        _disableDropOutside: function(e){
            // run only once for all instances
            if (!QqUploader.UploadDropZone.dropOutsideDisabled ){

                QqUploader.attach(document, 'dragover', function(e){
                    if (e.dataTransfer){
                        e.dataTransfer.dropEffect = 'none';
                        e.preventDefault();

                    }

                });

                QqUploader.UploadDropZone.dropOutsideDisabled = true;

            }

        },
        _attachEvents: function(){
            var self = this;

            QqUploader.attach(self._element, 'dragover', function(e){
                if (!self._isValidFileDrag(e)) return;

                var effect = e.dataTransfer.effectAllowed;
                if (effect == 'move' || effect == 'linkMove'){
                    e.dataTransfer.dropEffect = 'move'; // for FF (only move allowed)

                } else {

                    e.dataTransfer.dropEffect = 'copy'; // for Chrome
                }

                e.stopPropagation();
                e.preventDefault();

            });

            QqUploader.attach(self._element, 'dragenter', function(e){
                if (!self._isValidFileDrag(e)) return;

                self._options.onEnter(e);
            });

            QqUploader.attach(self._element, 'dragleave', function(e){
                if (!self._isValidFileDrag(e)) return;

                self._options.onLeave(e);

                var relatedTarget = document.elementFromPoint(e.clientX, e.clientY);

                // do not fire when moving a mouse over a descendant
                if (QqUploader.contains(this, relatedTarget)) return;

                self._options.onLeaveNotDescendants(e);

            });

            QqUploader.attach(self._element, 'drop', function(e){
                if (!self._isValidFileDrag(e)) return;

                e.preventDefault();
                self._options.onDrop(e);
            });

        },
        _isValidFileDrag: function(e){
            var dt = e.dataTransfer,
            // do not check dt.types.contains in webkit, because it crashes safari 4

                isWebkit = navigator.userAgent.indexOf("AppleWebKit") > -1;

            // dt.effectAllowed is none in Safari 5
            // dt.types.contains check is for firefox

            return dt && dt.effectAllowed != 'none' &&

                (dt.files || (!isWebkit && dt.types.contains && dt.types.contains('Files')));

        }

    };

    QqUploader.UploadButton = function(o){
        this._options = {
            element: null,

            // if set to true adds multiple attribute to file input

            multiple: false,
            // name attribute of file input
            name: 'file',
            onChange: function(input){},
            hoverClass: 'QqUploader-upload-button-hover',
            focusClass: 'QqUploader-upload-button-focus'

        };

        QqUploader.extend(this._options, o);

        this._element = this._options.element;

        // make button suitable container for input
        QqUploader.css(this._element, {
            position: 'relative',
            overflow: 'hidden',
            // Make sure browse button is in the right side
            // in Internet Explorer
            direction: 'ltr'
        });

        this._input = this._createInput();
    };

    QqUploader.UploadButton.prototype = {
        /* returns file input element */

        getInput: function(){
            return this._input;
        },
        /* cleans/recreates the file input */
        reset: function(){
            if (this._input.parentNode){
                QqUploader.remove(this._input);

            }

            QqUploader.removeClass(this._element, this._options.focusClass);
            this._input = this._createInput();
        },

        _createInput: function(){

            var input = document.createElement("input");

            if (this._options.multiple){
                input.setAttribute("multiple", "multiple");
            }

            input.setAttribute("type", "file");
            input.setAttribute("name", this._options.name);

            QqUploader.css(input, {
                position: 'absolute',
                // in Opera only 'browse' button
                // is clickable and it is located at
                // the right side of the input
                right: 0,
                top: 0,
                fontFamily: 'Arial',
                // 4 persons reported this, the max values that worked for them were 243, 236, 236, 118
                fontSize: '118px',
                margin: 0,
                padding: 0,
                cursor: 'pointer',
                opacity: 0
            });

            this._element.appendChild(input);

            var self = this;
            QqUploader.attach(input, 'change', function(){
                self._options.onChange(input);
            });

            QqUploader.attach(input, 'mouseover', function(){
                QqUploader.addClass(self._element, self._options.hoverClass);
            });
            QqUploader.attach(input, 'mouseout', function(){
                QqUploader.removeClass(self._element, self._options.hoverClass);
            });
            QqUploader.attach(input, 'focus', function(){
                QqUploader.addClass(self._element, self._options.focusClass);
            });
            QqUploader.attach(input, 'blur', function(){
                QqUploader.removeClass(self._element, self._options.focusClass);
            });

            // IE and Opera, unfortunately have 2 tab stops on file input
            // which is unacceptable in our case, disable keyboard access
            if (window.attachEvent){
                // it is IE or Opera
                input.setAttribute('tabIndex', "-1");
            }

            return input;

        }

    };

    /**
     * Class for uploading files, uploading itself is handled by child classes
     */
    QqUploader.UploadHandlerAbstract = function(o){
        this._options = {
            debug: false,
            action: '/upload.php',
            // maximum number of concurrent uploads

            maxConnections: 999,
            onProgress: function(id, fileName, loaded, total){},
            onComplete: function(id, fileName, response){},
            onCancel: function(id, fileName){}
        };
        QqUploader.extend(this._options, o);

        this._queue = [];
        // params for files in queue
        this._params = [];
    };
    QqUploader.UploadHandlerAbstract.prototype = {
        log: function(str){
            if (this._options.debug && window.console) console.log('[uploader] ' + str);

        },
        /**
         * Adds file or file input to the queue
         * @returns id
         **/

        add: function(file){},
        /**
         * Sends the file identified by id and additional query params to the server
         */
        upload: function(id, params){
            var len = this._queue.push(id);

            var copy = {};

            QqUploader.extend(copy, params);
            this._params[id] = copy;

            // if too many active uploads, wait...
            if (len <= this._options.maxConnections){

                this._upload(id, this._params[id]);
            }
        },
        /**
         * Cancels file upload by id
         */
        cancel: function(id){
            this._cancel(id);
            this._dequeue(id);
        },
        /**
         * Cancells all uploads
         */
        cancelAll: function(){
            for (var i=0; i<this._queue.length; i++){
                this._cancel(this._queue[i]);
            }
            this._queue = [];
        },
        /**
         * Returns name of the file identified by id
         */
        getName: function(id){},
        /**
         * Returns size of the file identified by id
         */

        getSize: function(id){},
        /**
         * Returns id of files being uploaded or
         * waiting for their turn
         */
        getQueue: function(){
            return this._queue;
        },
        /**
         * Actual upload method
         */
        _upload: function(id){},
        /**
         * Actual cancel method
         */
        _cancel: function(id){},

        /**
         * Removes element from queue, starts upload of next
         */
        _dequeue: function(id){
            var i = QqUploader.indexOf(this._queue, id);
            this._queue.splice(i, 1);

            var max = this._options.maxConnections;

            if (this._queue.length >= max && i < max){
                var nextId = this._queue[max-1];
                this._upload(nextId, this._params[nextId]);
            }
        }

    };

    /**
     * Class for uploading files using form and iframe
     * @inherits QqUploader.UploadHandlerAbstract
     */
    QqUploader.UploadHandlerForm = function(o){
        QqUploader.UploadHandlerAbstract.apply(this, arguments);

        this._inputs = {};
    };
// @inherits QqUploader.UploadHandlerAbstract
    QqUploader.extend(QqUploader.UploadHandlerForm.prototype, QqUploader.UploadHandlerAbstract.prototype);

    QqUploader.extend(QqUploader.UploadHandlerForm.prototype, {
        add: function(fileInput){
            fileInput.setAttribute('name', 'qqfile');
            var id = 'QqUploader-upload-handler-iframe' + QqUploader.getUniqueId();

            this._inputs[id] = fileInput;

            // remove file input from DOM
            if (fileInput.parentNode){
                QqUploader.remove(fileInput);
            }

            return id;
        },
        getName: function(id){
            // get input value and remove path to normalize
            return this._inputs[id].value.replace(/.*(\/|\\)/, "");
        },

        _cancel: function(id){
            this._options.onCancel(id, this.getName(id));

            delete this._inputs[id];

            var iframe = document.getElementById(id);
            if (iframe){
                // to cancel request set src to something else
                // we use src="javascript:false;" because it doesn't
                // trigger ie6 prompt on https
                iframe.setAttribute('src', 'javascript:false;');

                QqUploader.remove(iframe);
            }
        },

        _upload: function(id, params){

            var input = this._inputs[id];

            if (!input){
                throw new Error('file with passed id was not added, or already uploaded or cancelled');
            }

            var fileName = this.getName(id);

            var iframe = this._createIframe(id);
            var form = this._createForm(iframe, params);
            form.appendChild(input);

            var self = this;
            this._attachLoadEvent(iframe, function(){

                self.log('iframe loaded');

                var response = self._getIframeContentJSON(iframe);

                self._options.onComplete(id, fileName, response);
                self._dequeue(id);

                delete self._inputs[id];
                // timeout added to fix busy state in FF3.6
                setTimeout(function(){
                    QqUploader.remove(iframe);
                }, 1);
            });

            form.submit();

            QqUploader.remove(form);

            return id;
        },

        _attachLoadEvent: function(iframe, callback){
            QqUploader.attach(iframe, 'load', function(){
                // when we remove iframe from dom
                // the request stops, but in IE load
                // event fires
                if (!iframe.parentNode){
                    return;
                }

                // fixing Opera 10.53
                if (iframe.contentDocument &&
                    iframe.contentDocument.body &&
                    iframe.contentDocument.body.innerHTML == "false"){
                    // In Opera event is fired second time
                    // when body.innerHTML changed from false
                    // to server response approx. after 1 sec
                    // when we upload file with iframe
                    return;
                }

                callback();
            });
        },
        /**
         * Returns json object received by iframe from server.
         */
        _getIframeContentJSON: function(iframe){
            // iframe.contentWindow.document - for IE<7
            var doc = iframe.contentDocument ? iframe.contentDocument: iframe.contentWindow.document,
                response;

            this.log("converting iframe's innerHTML to JSON");
            this.log("innerHTML = " + doc.body.innerHTML);

            try {
                response = eval("(" + doc.body.innerHTML + ")");
            } catch(err){
                response = {};
            }

            return response;
        },
        /**
         * Creates iframe with unique name
         */
        _createIframe: function(id){
            // We can't use following code as the name attribute
            // won't be properly registered in IE6, and new window
            // on form submit will open
            // var iframe = document.createElement('iframe');
            // iframe.setAttribute('name', id);

            var iframe = QqUploader.toElement('<iframe src="javascript:false;" name="' + id + '" />');
            // src="javascript:false;" removes ie6 prompt on https

            iframe.setAttribute('id', id);

            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            return iframe;
        },
        /**
         * Creates form, that will be submitted to iframe
         */
        _createForm: function(iframe, params){
            // We can't use the following code in IE6
            // var form = document.createElement('form');
            // form.setAttribute('method', 'post');
            // form.setAttribute('enctype', 'multipart/form-data');
            // Because in this case file won't be attached to request
            var form = QqUploader.toElement('<form method="post" enctype="multipart/form-data"></form>');

            var queryString = QqUploader.obj2url(params, this._options.action);

            form.setAttribute('action', queryString);
            form.setAttribute('target', iframe.name);
            form.style.display = 'none';
            document.body.appendChild(form);

            return form;
        }
    });

    /**
     * Class for uploading files using xhr
     * @inherits QqUploader.UploadHandlerAbstract
     */
    QqUploader.UploadHandlerXhr = function(o){
        QqUploader.UploadHandlerAbstract.apply(this, arguments);

        this._files = [];
        this._xhrs = [];

        // current loaded size in bytes for each file

        this._loaded = [];
    };

// static method
    QqUploader.UploadHandlerXhr.isSupported = function(){
        var input = document.createElement('input');
        input.type = 'file';

        return (
            'multiple' in input &&
                typeof File != "undefined" &&
                typeof (new XMLHttpRequest()).upload != "undefined" );

    };

// @inherits QqUploader.UploadHandlerAbstract
    QqUploader.extend(QqUploader.UploadHandlerXhr.prototype, QqUploader.UploadHandlerAbstract.prototype)

    QqUploader.extend(QqUploader.UploadHandlerXhr.prototype, {
        /**
         * Adds file to the queue
         * Returns id to use with upload, cancel
         **/

        add: function(file){
            if (!(file instanceof File)){
                throw new Error('Passed obj in not a File (in QqUploader.UploadHandlerXhr)');
            }

            return this._files.push(file) - 1;

        },
        getName: function(id){

            var file = this._files[id];
            // fix missing name in Safari 4
            return file.fileName != null ? file.fileName : file.name;

        },
        getSize: function(id){
            var file = this._files[id];
            return file.fileSize != null ? file.fileSize : file.size;
        },

        /**
         * Returns uploaded bytes for file identified by id

         */

        getLoaded: function(id){
            return this._loaded[id] || 0;

        },

        /**
         * Sends the file identified by id and additional query params to the server
         *
         * @param id int
         * @param params object of name-value string pairs
         * @private
         */
        _upload: function(id, params){
            var file = this._files[id],
                name = this.getName(id),
                size = this.getSize(id);

            this._loaded[id] = 0;

            var xhr = this._xhrs[id] = new XMLHttpRequest();
            var self = this;

            xhr.upload.onprogress = function(e){
                if (e.lengthComputable){
                    self._loaded[id] = e.loaded;
                    self._options.onProgress(id, name, e.loaded, e.total);
                }
            };

            xhr.onreadystatechange = function(){

                if (xhr.readyState == 4){
                    self._onComplete(id, xhr);

                }
            };

            // build query string
            params = params || {};
            params['qqfile'] = name;
            var queryString = QqUploader.obj2url(params, this._options.action);

            xhr.open("POST", queryString, true);
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.setRequestHeader("X-File-Name", encodeURIComponent(name));
            xhr.setRequestHeader("Content-Type", "application/octet-stream");
            xhr.send(file);
        },
        _onComplete: function(id, xhr){
            // the request was aborted/cancelled
            if (!this._files[id]) return;

            var name = this.getName(id);
            var size = this.getSize(id);

            this._options.onProgress(id, name, size, size);

            if (xhr.status == 200){
                this.log("xhr - server response received");
                this.log("responseText = " + xhr.responseText);

                var response;

                try {
                    response = eval("(" + xhr.responseText + ")");
                } catch(err){
                    response = {};
                }

                this._options.onComplete(id, name, response);

            } else {

                this._options.onComplete(id, name, {});
            }

            this._files[id] = null;
            this._xhrs[id] = null;

            this._dequeue(id);

        },
        _cancel: function(id){
            this._options.onCancel(id, this.getName(id));

            this._files[id] = null;

            if (this._xhrs[id]){
                this._xhrs[id].abort();
                this._xhrs[id] = null;

            }
        }
    });

    window.qqUploader = QqUploader;
})();


/**
 * Slug Generator
 */
Craft.SlugGenerator = Craft.BaseInputGenerator.extend({

	generateTargetValue: function(sourceVal)
	{
		// Remove HTML tags
		sourceVal = sourceVal.replace("/<(.*?)>/g", '');

		// Make it lowercase
		sourceVal = sourceVal.toLowerCase();

		// Convert extended ASCII characters to basic ASCII
		sourceVal = Craft.asciiString(sourceVal);

		// Slug must start and end with alphanumeric characters
		sourceVal = sourceVal.replace(/^[^a-z0-9]+/, '');
		sourceVal = sourceVal.replace(/[^a-z0-9]+$/, '');

		// Get the "words"
		var words = Craft.filterArray(sourceVal.split(/[^a-z0-9]+/));

		if (words.length)
		{
			return words.join('-');
		}
		else
		{
			return '';
		}
	}
});


})(jQuery);
