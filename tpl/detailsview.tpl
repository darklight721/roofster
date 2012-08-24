<div class="details">
	<h3>Roof Details</h3>
	<a class="btn pull-right" href="#"><i class="icon-arrow-left"></i> Back</a>
	
	<div class="span3">
		<span class="label">For Rent</span>
		<div class="well well-small"><i class="icon-home"></i> <strong>{{type}}</strong></div>
	</div>
	
	<div class="span3">
		<span class="label">Address</span>
		<div class="well well-small"><i class="icon-map-marker"></i> {{address}}</div>
	</div>
	
	<div class="span3">
		<span class="label">Rate</span>
		<div class="well well-small"><i class="icon-tag"></i> PHP {{rate}} per month</div>
	</div>
	
	<div class="span3">
		<span class="label">Contact Person</span>
		<div class="well well-small"><i class="icon-user"></i> {{contact_person}}</div>
	</div>
	
	<div class="span3">
		<span class="label">Contact Number</span>
		<div class="well well-small"><i class="icon-envelope"></i> {{contact_number}}</div>
	</div>
	
	{{#if details}}
	<div class="span3">
		<span class="label">Other Details</span>
		<div class="well well-small"><i class="icon-list"></i> {{details}}</div>
	</div>
	{{/if}}
	
	{{#if pictures}}
	<div class="span3">
		<span class="label">Pictures</span><br/>
		<ul class="thumbnails">
		{{#each pictures}}
			<li class="span2">
				<a href="#" class="thumbnail">
					<img src="{{this}}">
				</a>
			</li>
		{{/each}}
		</ul>
	</div>
	{{/if}}
	
	<button class="btn span3" type="button"><i class="icon-edit"></i> Edit</button>
</div>