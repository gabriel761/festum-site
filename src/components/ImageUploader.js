import React, { useState, useRef,  } from 'react';

import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBFile,
  MDBCardImage,
  MDBBtn
} from 'mdb-react-ui-kit';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // Limite de 5MB

const ImageUploader = ({previewImage, setPreviewImage}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  
  const [uploadError, setUploadError] = useState(null);

  const fileInputRef = useRef(null);
  const reader = new FileReader();
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    // Verificar o tamanho do arquivo
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`O arquivo selecionado é muito grande. O tamanho máximo permitido é de ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
      return;
    }

    setSelectedImage(file);

    
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedImage) return;

    // Aqui você pode realizar o envio da imagem para o servidor
    // usando o objeto "selectedImage"

    // Limpar os estados após o envio
    setSelectedImage(null);
    setPreviewImage(null);
    setUploadError(null);

    // Limpar o campo de entrada do arquivo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearPreview = () => {
    setSelectedImage(null);
    setPreviewImage(null);
    setUploadError(null);

    // Limpar o campo de entrada do arquivo
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <MDBCard className='shadow-4'>
      <MDBCardImage className='align-self-center shadow-4-strong' style={{ borderRadius: 250, height: 150, width: 150, marginTop: 10 }} src={previewImage} position='top' alt='...' />
      <MDBCardBody className='d-flex justify-content-between'>
        <input type='file' ref={fileInputRef} style={{maxWidth: 400}} onChange={handleImageChange} id='customFile' />
        <MDBBtn  onClick={handleClearPreview} color='secondary'>Remover</MDBBtn>
      </MDBCardBody>
    </MDBCard>
  );
};

export default ImageUploader;

