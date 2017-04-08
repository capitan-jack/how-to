var React = require('react');

//writing a lot of inline css for now.
var FullscreenHowTo = React.createClass({
	componentWillMount : function(){
		this.setState({activeText:0, activeTimer:0,
					   readIntro:true,timeDisplay:this.props.data.steps[0].time});
	},
	componentDidMount: function(){
		this.setState({stepChangeSound:new Audio('https://s3-us-west-2.amazonaws.com/fs-brew-static-images/step_change.mp3')});
	},
	open: function(){
		this.refs.main.style.display = 'block';
	},
	close: function(){
		this.refs.main.style.display = 'None';
		clearInterval(this.state.ticker);
		this.setState({ticker: null, activeText:0, activeTimer:0,
				   	   readIntro:true,timeDisplay:this.props.data.steps[0].time});
	},
	start: function(){
		if(!this.state.ticker){
			this.setState({ticker: setInterval(this.updateTimeDisplay, 1000),
					   	   readIntro:false});
		}
	},
	readNextStep: function(){
		var _activeText = this.state.activeText + 1;
		if(_activeText<this.props.data.steps.length){
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
		this.setState({timeDisplay: this.props.data.steps[_activeText].time,
					   activeTimer:_activeText,
					   stepTransitioning:setTimeout(this.startSetStep, 1000)});
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
		if(_activeTimer<this.props.data.steps.length){
			this.setState({timeDisplay: this.props.data.steps[_activeTimer].time,
					   		activeTimer:_activeTimer,
					   		activeText:_activeTimer,
					   		stepTransitioning:setTimeout(this.startSetStep, 1000)});
			return;
		}
		clearInterval(this.state.ticker);
		this.setState({timeDisplay: '- -',
					   	activeTimer:this.props.data.steps.length,
					   	ticker:null});
	},
	startSetStep:function(){
		this.setState({stepTransitioning:null}, this.timerToggle);
	},
	render: function(){
		var displayNode = <p key={2} time={15} style={{fontSize:'2rem'}}>
                      			{this.props.data.steps[this.state.activeText].step}
                  		  </p>
        var infoText = "";
        if(this.props.data.steps[this.state.activeText].pu){
        	infoText = <p style={{fontSize:'1rem', color:'#807b7b'}}>(You can tap the countdown to play/pause to cook until satisfied)</p>;
        }
		var activeTimerDisplayVal = this.state.activeTimer + 1;
		var activeReadDisplayVal = this.state.activeText + 1;
		var intro = "";
		var closeButton = <i className="material-icons" style={{position:'fixed', top:'1vh', right:'1vw',zIndex:'1010',fontSize:'1.5rem',color:'black'}} 
							 onClick={this.close}>close</i>;
		if(this.state.readIntro){
			intro = <div ref="intro" key="intro" style={{position:'fixed', top:'0px', left:'0px',height:'100vh', 
						 			width:'100vw', textAlign:'center', backgroundColor:'white',
					     			display:'block', zIndex:'1005',}}>
		     			<button key="startButton" ref="startButton" style={{border:'1px solid #ff5722',borderRadius:'20px', 
		     																  width:'70vw', backgroundColor:'white',position:'fixed',
		     																  bottom:'2vh',left:'15vw', fontSize:'4vh', fontWeight:'bold'}}
		     					onClick={this.start}>
		     				Start
		     			</button>
					</div>;
		}
		var jumpControl = "";
		var activeTimerStatus = <p style={{fontSize:'0.8rem', color:'white', margin:'0px', padding:'0px', fontWeight:'bold'}}>
									Remaining to complete step {activeTimerDisplayVal + "/" + this.props.data.steps.length}.
						   		</p>;
		if(this.state.activeText != this.state.activeTimer){
			jumpControl = <span style={{width:'33vw', height:'100%'}} onClick={this.startJumpStepTimer}>
								<i className="material-icons" style={{borderRadius:'50%', fontSize:'2rem',
																	  lineHeight:'3rem', width:'3rem', height:'3rem',
																	  backgroundColor:'#f8f8f8', color:'#ff5722',
																	  boxShadow:'0px 0px 4px 0px rgba(0,0,0,0.4)',
																	  display:'inline-block'}}>fast_forward</i>
								<div style={{fontSize:'10px', textAlign:'center', margin:'10px 0 0 0'}}>Start step {activeReadDisplayVal}</div>
							</span>;
		}
		if(this.state.activeTimer == this.props.data.steps.length){
			activeTimerStatus = <p style={{fontSize:'0.8rem', color:'white', margin:'0px', padding:'0px', fontWeight:'bold'}}>
									Completed All steps.
						   		</p>;
			jumpControl = <span style={{width:'33vw', height:'100%'}} onClick={this.start}>
								<i className="material-icons" style={{borderRadius:'50%', fontSize:'2rem',
																	  lineHeight:'3rem', width:'3rem', height:'3rem',
																	  backgroundColor:'#f8f8f8', color:'#ff5722',
																	  boxShadow:'0px 0px 4px 0px rgba(0,0,0,0.4)',
																	  display:'inline-block'}}>replay</i>
								<div style={{fontSize:'10px', textAlign:'center', margin:'10px 0 0 0'}}>Restart</div>
							</span>;
		}
		var stepTransition="";
		if(this.state.stepTransitioning){
			this.state.stepChangeSound.play();
			stepTransition=<div ref="transitionCover" style={{position:'fixed', top:'0px', left:'0px',height:'100vh', 
						 			width:'100vw', textAlign:'center', backgroundColor:'white',
					     			display:'block', zIndex:'1005', color:'#ff5722'}}>
					     			<div style={{position:'relative', top:'40vh',}}>
					     				<i className="material-icons" style={{fontSize:'10vh',}}>alarm</i>
				                      	<p style={{fontSize:'2rem',}}>Starting step {activeTimerDisplayVal + "/" + this.props.data.steps.length}</p>
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
				<div ref="stepContent" style={{padding:'1rem 0.8rem 1rem 0.8rem', height:'63vh',overflow:'auto'}}>
					{displayNode}
					{infoText}
				</div>
				<div ref="controls" style={{height:'12vh',textAlign:'center'}}>
					{jumpControl}
				</div>
				<div ref="bookmark" style={{position:'fixed', left:'0px', width:'100vw', bottom:'0px',
										 	height:'10vh', backgroundColor:'white', color:'#ff5722',
										    borderTop:'1px solid #ff5722',}}>
					<i className="material-icons" style={{width:'5rem', float:'left',
														  fontSize:'10vh',}}
						onClick={this.readPrevStep}>
						keyboard_arrow_left
					</i>
					<p style={{fontSize:'7vh', lineHeight:'10vh', display:'inline-block', margin:'0px', padding:'0px'}}>
						{activeReadDisplayVal + "/" + this.props.data.steps.length}
					</p>
					<i className="material-icons" style={{width:'5rem', float:'right',
														  fontSize:'10vh',}}
						onClick={this.readNextStep}>
						keyboard_arrow_right
					</i>
				</div>
				{closeButton}
				{intro}
				{stepTransition}
			</div>
		);
	},

});

module.exports = FullscreenHowTo;
