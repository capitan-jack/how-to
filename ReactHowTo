var React = require('react');


var FullscreenSlider = React.createClass({
	componentWillMount : function(){
		var totalTime = 0;
		var refTimers = React.Children.map(this.props.children, 
										   function(child){
										   	totalTime+=child.props.time;
										  	return {ref:child.key, timer:child.props.time,
										  			elapsed:totalTime-child.props.time, node:child};
										   });
		this.setState({refTimers:refTimers, totalTime:totalTime, 
					   stepCount:refTimers.length, activeText:0, activeTimer:0, 
					   timeDisplay: refTimers[0].timer,});
	},
	componentDidMount: function(){
	},
	open: function(){
		this.refs.main.style.display = 'block';
	},
	close: function(){
		this.refs.main.style.display = 'None';
	},
	start: function(){
		if(!this.state.ticker){
			this.setState({ticker: setInterval(this.updateTimeDisplay, 1000),
						   refTimers:this.state.refTimers, totalTime:this.state.totalTime, 
					       stepCount:this.state.refTimers.length, activeText:0, activeTimer:0, 
					       timeDisplay: this.state.refTimers[0].timer});
		}
	},
	
	readNextStep: function(){
		var _activeText = this.state.activeText + 1;
		if(_activeText<this.state.stepCount){
			this.setState({activeText:_activeText});
		}
	},
	readPrevStep: function(){
		var _activeText = this.state.activeText - 1;
		if(_activeText>=0){
			this.setState({activeText:_activeText});
		}
	},
	timerToggle:function(){
		if(this.state.ticker){
			clearInterval(this.state.ticker);
			this.setState({ticker:null});
		}else{
			this.setState({ticker:setInterval(this.updateTimeDisplay, 1000)});
		}
	},
	startJumpStepTimer: function(){
		var _activeText = this.state.activeText;
		this.timerToggle();
		this.setState({timeDisplay: this.state.refTimers[_activeText].timer,
					   activeTimer:_activeText,
					   stepTransitioning:setTimeout(this.startSetStep, 1000)});
	},
	doubleClicker: function(){
		if(!this.state.doubleClicker){
			this.setState({doubleClicker:setTimeout(this.clearDoubleClicker,450)});
		}else{
			clearTimeout(this.state.doubleClicker);
			this.setState({doubleClicker:null}, function(){
				if(this.state.ticker){
					this.startJumpStepTimer();
				}else{
					this.start();
				}
			}.bind(this));			
		}
	},
	clearDoubleClicker:function(){
		clearTimeout(this.doubleClicker);
		this.setState({doubleClicker:null});
	},
	updateTimeDisplay: function(){
		if(this.state.timeDisplay == 0){
			this.timerToggle();
			this.startNextStep();
			return;
		}
		this.setState({timeDisplay:(this.state.timeDisplay-1)});
	},
	startNextStep: function(){
		var _activeTimer = this.state.activeTimer + 1;
		if(_activeTimer<this.state.stepCount){
			this.setState({timeDisplay: this.state.refTimers[_activeTimer].timer,
					   		activeTimer:_activeTimer,
					   		activeText:_activeTimer,
					   		stepTransitioning:setTimeout(this.startSetStep, 1000)});
			return;
		}
		clearInterval(this.state.ticker);
		this.setState({timeDisplay: '- -',
					   	activeTimer:this.state.stepCount,
					   	ticker:null});
	},
	startSetStep:function(){
		this.setState({stepTransitioning:null}, this.timerToggle);
	},
	render: function(){
		var displayNode = this.state.refTimers[this.state.activeText].node;
		var activeTimerDisplayVal = this.state.activeTimer + 1;
		var activeReadDisplayVal = this.state.activeText + 1;
		var activeStatus = <p style={{fontSize:'0.8rem', color:'green', margin:'0px', padding:'0px', fontWeight:'bold', lineHeight:'0.8rem'}}>
								Reading active step.
						   </p>;
		var activeTimerStatus = <p style={{fontSize:'0.8rem', color:'white', margin:'0px', padding:'0px', fontWeight:'bold'}}>
									Remaining to complete step {activeTimerDisplayVal + "/" + this.state.stepCount}.
						   		</p>;
		if(this.state.activeText != this.state.activeTimer){
			activeStatus = <p style={{fontSize:'0.7rem', color:'red', margin:'0px', padding:'0px', fontWeight:'bold', lineHeight:'0.7rem'}}>
								Double tap here to start this step.
						   </p>;
		}
		if(this.state.activeTimer == this.state.stepCount){
			activeTimerStatus = <p style={{fontSize:'0.8rem', color:'white', margin:'0px', padding:'0px', fontWeight:'bold'}}>
									Completed All steps.
						   		</p>;
			activeStatus = <p style={{fontSize:'0.7rem', color:'red', margin:'0px', padding:'0px', fontWeight:'bold', lineHeight:'0.7rem'}}>
								Double tap here to restart.
						   </p>;
		}
		var stepTransition="";
		if(this.state.stepTransitioning){
			stepTransition=<div ref="transitionCover" style={{position:'fixed', top:'0px', left:'0px',height:'100vh', 
						 			width:'100vw', textAlign:'center', backgroundColor:'white',
					     			display:'block', zIndex:'1005', color:'#ff5722'}}>
					     			<div style={{position:'relative', top:'40vh',}}>
					     				<i className="material-icons" style={{fontSize:'10vh',}}>alarm</i>
				                      	<p style={{fontSize:'2rem',}}>Starting step {activeTimerDisplayVal + "/" + this.state.stepCount}</p>
				                   	</div>

					     	</div>
		}
		return (
			<div ref="main" style={{position:'fixed', top:'0px', left:'0px',height:'100vh', 
						 			width:'100vw', textAlign:'center', backgroundColor:'white',
					     			display:'none', zIndex:'1000'}}>
				<div ref="timer" style={{position:'relative', top:'0px', left:'0px', width:'100vw',
										 height:'15vh', backgroundColor:'#ff5722', color:'white'}}
					  onClick={this.timerToggle}>
					<p style={{fontSize:'14vh', textAlign:'center', margin:'0px', 
							   padding:'0px', lineHeight:'12vh'}}>{this.state.timeDisplay}</p>
					{activeTimerStatus}
				</div>
				<div ref="stepContent" style={{padding:'1rem 0.8rem 1rem 0.8rem', height:'75vh',overflow:'auto'}}>
					{displayNode}
				</div>
				<div ref="bookmark" style={{position:'fixed', left:'0px', width:'100vw', bottom:'0px',
										 	height:'10vh', backgroundColor:'white', color:'#ff5722',
										    borderTop:'1px solid #ff5722',}}>
					<i className="material-icons" style={{width:'5rem', float:'left',
														  fontSize:'10vh',}}
						onClick={this.readPrevStep}>
						keyboard_arrow_left
					</i>
					<p style={{fontSize:'7vh', lineHeight:'6vh', display:'inline-block', margin:'1vh 0 0 0', padding:'0px'}} onClick={this.doubleClicker}>
						{activeReadDisplayVal + "/" + this.state.stepCount}
					</p>
					<i className="material-icons" style={{width:'5rem', float:'right',
														  fontSize:'10vh',}}
						onClick={this.readNextStep}>
						keyboard_arrow_right
					</i>
					{activeStatus}
				</div>
				{stepTransition}
			</div>
		);
	},

});

module.exports = FullscreenSlider;
