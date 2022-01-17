import React, { Component } from 'react'
import styles from '../style.less'
export default class Loading extends Component {
  constructor(props) {
    super(props)
    this.state = {
      test1: '12345'
    }

    // this.sizeFunction.bind(this)
  }

  componentDidMount() {
    let style = document.createElement('style');
    style.type = 'text/css';
    let keyFrames = '\
    @keyframes spin {\
        0% {\
            transform: rotate(0deg);\
        }\
        100% {\
            transform: rotate(360deg);\
        }\
    }';
    style.innerHTML = keyFrames
    console.log(document.getElementsByClassName("loadingTest")[0])
    document.getElementsByClassName('loadingTest')[0].appendChild(style);
    // console.log( document.getElementsByClassName('loadingTest')[0].style)
  }

  sizeFunction() {
    const { size = 'md' } = this.props
    return size === 'sm' ? '15px' : size === 'md' ? '25px' : size === 'lg' ? '35px' :'25px'
  }

  colorFunction(){
    const { color = 'blue' } = this.props
    return `3px solid ${color}`
  }

  fatherFunction(){
    // console.log(document.getElementsByClassName("loadingTest")[0])
    // console.log(document.getElementsByClassName("loadingTest")) 
  }
 
  //





  render() {
    const size = this.sizeFunction()
    const color  = this.colorFunction()
    // const father = this.fatherFunction()
    return (
      <div
        className='loadingTest'
        style={{
          width: size,
          height: size,
          border: '3px solid white',
          borderTop: color,
          borderRadius: '50%',
          animation: 'spin 2s infinite',
          position:'absolute',
          top:0,
          left:'50%',
        }}
      >
      </div>
    )
  }
}
