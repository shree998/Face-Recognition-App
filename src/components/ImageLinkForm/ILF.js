import React from 'react';

const image = ({onInputChange, onButtonChange}) => {
	return(
			<div>
			<p className='f3'>
			{'This magic recognizes faces. Give it a try.'}
			</p>
			<div className='center'>
			<div className='center pa4 br3 shadow-5'>
			<input type='text' className='f4 pa2 w-70 center' onChange={onInputChange}></input>
			<button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple' onClick={onButtonChange}>Detect</button>
			</div>
			</div>
		</div>
	);
}

export default image;