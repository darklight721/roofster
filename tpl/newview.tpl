<div>
	<h3>Add a new Roof</h3>
	<a class='btn pull-right' href="#"><i class='icon-arrow-left'></i> Back</a>
</div>
<form style="margin-top:15px;">
	<div class="control-group">
		<span class="label label-info">Type</span>
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
	<div class="control-group">
		<span class="label label-info">Details</span>
		<br/>
		<textarea id="details" class="span3" rows="4"></textarea>
	</div>
	<div class="control-group">
		<span class="label label-info">Email</span>
		<br/>
		<input id="email" class="span3" size="16" type="email">
	</div>
	<div class="control-group">
		<span class="label label-info">Passcode</span>
		<br/>
		<input id="passcode" class="span3" size="16" type="password">
	</div>
	<button id="save" class="btn btn-primary span3" type="button" style="margin-left:0;">Save</button>
</form>
