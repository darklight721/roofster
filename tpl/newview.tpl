<div class="new">
	<div>
		<h3>Add a new Roof</h3>
		<a class='btn pull-right' href="#"><i class='icon-arrow-left'></i> Back</a>
	</div>
	<form style="margin-top:15px;">
		<div class="control-group">
			<span class="label label-info">For Rent</span>
			<div class="btn-group" data-toggle="buttons-radio">
				<button type="button" class="btn active type" data-type="room">Room</button>
				<button type="button" class="btn type" data-type="apartment">Apartment</button>
				<button type="button" class="btn type" data-type="house">House</button>
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
			<textarea id="address" class="span3"></textarea>
		</div>
		<div class="control-group">
			<span class="label label-info">Rate per month in PHP</span>
			<br/>
			<input id="rate" class="span3" size="16" type="number" min="0" step="100">
		</div>
		<div class="control-group">
			<span class="label label-info">Contact Person</span>
			<br/>
			<input id="contact_person" class="span3" size="16" type="text">
		</div>
		<div class="control-group">
			<span class="label label-info">Contact Number</span>
			<br/>
			<input id="contact_number" class="span3" size="16" type="text">
		</div>
		<legend><i class="icon-info-sign"></i> The succeeding fields are optional.</legend>
		<div class="control-group">
			<span class="label label-info">Details</span>
			<br/>
			<textarea id="details" class="span3" rows="4"></textarea>
		</div>
		<div class="control-group">
			<span class="label label-info">Pictures</span>
			<br/>
			<input id="pictures" type="file" style="display:none" accept="image/*" multiple>
			<div class="input-prepend">
				<button id="picture_chooser" class="btn" type="button" style="margin-bottom:9px;">&nbsp;<i class="icon-picture"></i>&nbsp;</button><input id="picture_names" size="16" type="text" readonly style="width:168px;margin-bottom:9px;">
			</div>
		</div>
		<legend><i class="icon-info-sign"></i> You may provide the following details so you will be able to edit or remove this roof in the future.</legend>
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
		<legend><i class="icon-exclamation-sign"></i> A roof will eventually be removed after 60 days from the day it was created, regardless if you have entered the previous details.</legend>
		<button id="save" class="btn btn-primary span3" type="button">Save</button>
	</form>
</div>