import React, { Component } from 'react';
import styled from 'styled-components';
import Dropzone from 'react-dropzone';

import ProductImageApi from 'api/ProductImageApi';
import { formatBytes } from '../utils';

const StyledDropzone = styled(Dropzone)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 200px;
  padding: 0.5rem;
  margin-bottom: 1.5rem;
  color: hsla(0, 0%, 0%, 0.6);
  border: 2px dashed hsl(0, 0%, 75%);
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out; 

  :hover {
    background-color: hsl(210, 80%, 96%);
  }
`

const Images = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
`

const ImageWrapper = styled.div`
  width: 32%;
  margin-bottom: 10px;
  font-size: 0.8rem;
  text-align: center;
`

const Image = styled.img`
  width: 100%;
  border-radius: 3px;
`

const ImageInfo = styled.div`
  color: hsla(0, 0%, 0%, 0.75);
  ${props => props.bold && 'font-weight: bold;'}
`

class ImageSelect extends Component {
  render() { 
    const { onDrop, images, onImageClick, oldImages = [], onOldImageClick } = this.props;
    return ( 
      <StyledDropzone
          accept="image/*"
          onDrop={onDrop}
          acceptStyle={{ border: '3px solid hsl(110, 50%, 80%)', background: 'hsl(110, 50%, 97%)'}}
          rejectStyle={{ border: '3px solid hsl(00, 50%, 80%)', background: 'hsl(0, 50%, 97%)'}}
        >
          {images.length !== 0 || oldImages.length !== 0 
            ? <p style={{ textAlign: 'center' }}>Click on the image to remove</p> 
            : <p style={{ textAlign: 'center' }}>Drop images here or click to select</p>
          }

          <Images>
            {oldImages.map(i => 
              <ImageWrapper key={i.id}>
                <Image onClick={e => { e.stopPropagation(); onOldImageClick(i.id)}} alt={i.name} src={ProductImageApi.get(i.id)}/>
              </ImageWrapper>
            )}
            {images.map(i => 
              <ImageWrapper key={i.name}>
                <Image onClick={e => { e.stopPropagation(); onImageClick(i.name)}} alt={i.name} src={i.preview}/>
                <ImageInfo bold>{i.name}</ImageInfo>
                <ImageInfo>{formatBytes(i.size)}</ImageInfo>
              </ImageWrapper>
            )}
          </Images>
        </StyledDropzone>
     )
  }
}
 
export default ImageSelect;