import React, {Component} from 'react';
import './App.css';
import Clarifai from 'clarifai';
import Navi from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ILF';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';


const app = new Clarifai.App({
 apiKey: '69ff3333681a426da4275aa550341ed8'
});

const particlesOptions = {
	  particles: {
                       
                  number: { 
					  value: 50,
                   	  density: {
	  						enable: true,
	  						value_area: 800
	  	  }
         }
                        
        }
	  } 
class App extends Component {
	constructor(){
		super();
		this.state={
			input:'',
			imageURL:'',
			box:{},
			route:'signin',
			isSignedIn: false
		}
	}
	
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
		console.log(box);
		this.setState({box: box});
	}
	
	onInputChange = (event) => {
		this.setState({input: event.target.value});
	}
	
	
 
  onButtonChange = () => {
    this.setState({imageURL:this.state.input});
    app.models
		.predict(Clarifai.FACE_DETECT_MODEL,
        
        // THE JPG
        this.state.input 
      )
      .then((response) => {
       this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch((err) => {
        console.log(err);
      });
  };


	onRouteChange = (route) => {
		if(route ==='signout')
			{
				this.setState({isSignedIn:false});
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
							  <Rank/>
							  <ImageLinkForm onInputChange={this.onInputChange} onButtonChange={this.onButtonChange}/>
							  <FaceRecognition box= {this.state.box} imageURL={this.state.imageURL} />
								</div>
				  				:(
				  					this.state.route === 'signin'?
				  					<SignIn onRouteChange={this.onRouteChange}/>
			  						:<Register onRouteChange={this.onRouteChange}/>
			  						)
								} 
				  </div>
					);
				}

  			}
	
export default App;
