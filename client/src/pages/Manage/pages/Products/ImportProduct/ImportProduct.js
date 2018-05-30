import React from 'react'
import Config from 'api/Config'
import ProductStore from '../../../../../stores/ProductStore'


class ImportProduct extends React.Component {

  fileUpload(e){
    const formData = new FormData();
    formData.append('file',e.target.files[0])

    //TODO: Move to API
    fetch(Config.url + `/upload`, {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(() => {
      ProductStore.getAll()
    })
  }

  render() {
    return (
        <label htmlFor="upload">
            <input type="file" id="upload" onChange={this.fileUpload} style={{display: "none"}}/>
            Import product
        </label>
   )
  }
}



export default ImportProduct