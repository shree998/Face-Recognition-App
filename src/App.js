import React, {Component} from 'react';
import './App.css';
import Navi from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ILF';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';


const originalState= {
								input:'',
								imageURL:'',
								box:{},
								route:'signin',
								isSignedIn: false,
								user :{
										id:'',
										name:"",
										email:"",
										entries:0,
										joined:''
								}
}

const particlesOptions = {
	  particles: {
                       
                  number: { 
					  value: 100,
                   	  density: {
	  						enable: true,
	  						value_area: 1000
	  	  }
         }
                        
        }
	  } 
class App extends Component {
	constructor(){
		super();
		this.state=originalState;
		}
	
	
		loadUser = (data) =>{
			this.setState({user:{
									id:data.id,
									name:data.name,
									email:data.email,
									entries:data.entries,
									joined:data.joined
			}})}
		
	calculateFaceLocation = (data) => {
		const Face= data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById("inputImage");
		const width = Number(image.width);
		const height = Number(image.height);
		return{
			leftCol: Face.left_col * width,
			topRow: Face.top_row * height,
			rightCol: width - (Face.right_col * width),
			bottomRow: height - (Face.bottom_row * height)
		}
	}
	
	displayFaceBox = (box) => {
			this.setState({box: box});
	}
	
	onInputChange = (event) => {
		this.setState({input: event.target.value});
	}
	
	
 
  onButtonChange = () => {
    this.setState({imageURL:this.state.input});
   	 fetch('https://floating-beyond-00173.herokuapp.com/imageurl',{
					method:'post',
					headers:{'Content-Type':'application/json'},
					body: JSON.stringify({
						input: this.state.input
					})
					})
					.then(response => response.json())
					  .then(response => {
						if(response)
							{
								fetch('https://floating-beyond-00173.herokuapp.com/image',{
									method:'put',
									headers:{'Content-Type':'application/json'},
									body: JSON.stringify({
										id: this.state.user.id
									})
									})
									.then(response => response.json())
									.then(count => {
										this.setState(Object.assign(this.state.user, {entries:count}) )
									})
								}
						   this.displayFaceBox(this.calculateFaceLocation(response))
						  })
						  .catch((err) => {
							console.log(err);
						  });
					  };


	onRouteChange = (route) => {
		if(route ==='signout')
			{
				this.setState(originalState);
			}
		else if(route ==='home')
			{
				this.setState({isSignedIn:true});
			}
		this.setState({route: route}) ;
	}

  render(){
	  return ( 
	  
    			<div className="App">
				  <Particles className="particles"
						params={particlesOptions} />
			  			<Navi onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn}/>
			  			{this.state.route === 'home'?
			  				<div>
				  			  <Logo/>
							  <Rank name={this.state.user.name} entries={this.state.user.entries}/>
							  <ImageLinkForm onInputChange={this.onInputChange} onButtonChange={this.onButtonChange}/>
							  <FaceRecognition box= {this.state.box} imageURL={this.state.imageURL} />
								</div>
				  				:(
				  					this.state.route === 'signin'?
				  					<SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> 
			  						:<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
			  						)
								} 
				  </div>
					);
				}

  			} 
	
export default App;
