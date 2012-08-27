<div class="new">
	<div>
		<h3>{{#if id}}Edit this Roof{{else}}Add a new Roof{{/if}}</h3>
		<a class='btn pull-right' href="#"><i class='icon-arrow-left'></i> Back</a>
	</div>
	<form style="margin-top:15px;">
		<div class="control-group">
			<span class="label label-info">For Rent</span>
			<div class="btn-group" data-toggle="buttons-radio">
				<button type="button" class="btn type {{#if isRoom}} active {{/if}}" data-type="room">Room</button>
				<button type="button" class="btn type {{#if isApartment}} active {{/if}}" data-type="apartment">Apartment</button>
				<button type="button" class="btn type {{#if isHouse}} active {{/if}}" data-type="house">House</button>
			</div>
		</div>
		<div class="control-group">
			<span class="label label-important">Pin to map</span>
			<br/>
			<label id="latitude" class="control-label">Click the location of your roof on the map.</label>
		</div>
		<div class="control-group">
			<span class="label label-info">Address</span>
			<br/>
			<textarea id="address" class="span3">{{address}}</textarea>
		</div>
		<div class="control-group">
			<span class="label label-info">Rate per month in PHP</span>
			<br/>
			<input id="rate" class="span3" size="16" type="number" min="0" step="100" value="{{rate}}">
		</div>
		<div class="control-group">
			<span class="label label-info">Contact Person</span>
			<br/>
			<input id="contact_person" class="span3" size="16" type="text" value="{{contact_person}}">
		</div>
		<div class="control-group">
			<span class="label label-info">Contact Number</span>
			<br/>
			<input id="contact_number" class="span3" size="16" type="text" value="{{contact_number}}">
		</div>
		<legend><i class="icon-info-sign"></i> The succeeding fields are optional.</legend>
		<div class="control-group">
			<span class="label label-info">Details</span>
			<br/>
			<textarea id="details" class="span3" rows="4">{{details}}</textarea>
		</div>
		<div class="control-group">
			<span class="label label-info">Pictures</span><span id="clear">[Clear]</span>
			<br/>
			<input id="pictures" type="file" style="display:none" accept="image/*" multiple>
			<div class="input-prepend">
				<button id="picture_chooser" class="btn" type="button" style="margin-bottom:9px;">&nbsp;<i class="icon-picture"></i>&nbsp;</button><input id="picture_names" size="16" type="text" readonly style="width:168px;margin-bottom:9px;" value="{{pictureNames}}">
			</div>
		</div>
		{{#if id}}
		<legend><i class="icon-exclamation-sign"></i> Did you create this roof? If so, provide the following details. These details should match what you've provided when you created this roof in order to save your changes or to remove this roof. </legend>
		{{else}}
		<legend><i class="icon-info-sign"></i> You may provide the following details so you will be able to edit or remove this roof in the future.</legend>
		{{/if}}
		<div class="control-group">
			<span class="label label-info">Email</span>
			<br/>
			<input id="email" class="span3" size="16" type="email" data-dependency="passcode">
		</div>
		<div class="control-group">
			<span class="label label-info">Passcode</span>
			<br/>
			<input id="passcode" class="span3" size="16" type="password" data-dependency="email">
		</div>
		{{#unless id}}
		<legend><i class="icon-exclamation-sign"></i> A roof will eventually be removed after 60 days from the day it was created, regardless if you have entered the previous details.</legend>
		{{/unless}}
		<button id="save" class="btn btn-primary span3" type="button" data-loading-text="Saving...">Save</button>
		{{#if id}}
		<button id="remove" class="btn btn-danger span3" type="button" data-loading-text="Removing...">Remove</button>
		{{/if}}
	</form>
</div>