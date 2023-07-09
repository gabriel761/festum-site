//import { View, FlatList, TouchableOpacity, Image, StyleSheet, Text } from "react-native";
//import * as ImagePicker from "expo-image-picker"
import { MDBCol, MDBRow, MDBCardImage, MDBCardTitle } from "mdb-react-ui-kit";
import { useRef, useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // Limite de 5MB
const UploadGaleria = ({ galeria, setGaleria }) => {
    const data = galeria.length != 0 ? galeria : [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ]

    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
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
        setGaleria(prev => [...prev, reader.result]);
        
      };
      reader.readAsDataURL(file);
    };

    const removeImage = (itemFlatlist) => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        const newData = data.filter((item) => item != itemFlatlist)
        setGaleria(newData)
    }
  


    return (
        <div>
            <MDBCardTitle style={styles.text}>Adicione imagens à sua galeria</MDBCardTitle>
            <MDBRow className="grid" style={styles.row}>
                {data.map((item, index ) => (
                        <MDBCol className="g-col-2"  onClick={() => removeImage(item)} style={styles.card} key={index}>
                            {galeria.length != 0 &&<MDBCardImage className='align-self-center shadow-4-strong' style={{ borderRadius:10, height: 100, width: 100, marginTop: 10 }} src={item} position='top' alt='...' />}
                        </MDBCol>
                    ))}
                
                {/* <div onClick={() => pickImage()} style={styles.botaoMais}>
                    <p style={styles.mais}>+</p>
                </div> */}
            </MDBRow>
            <MDBRow style={styles.inputFileRow}>
                <input type='file' ref={fileInputRef} style={{maxWidth: 400}} onChange={handleImageChange} id='customFile'/>
            </MDBRow>
        </div>
    );
}

const styles = {
    card: {
        borderWidth: 1,
        borderColor: "#bbbbbb",
        height: 100,
        width: 100,
        backgroundColor: "#cbcbcb",
        borderColor: "#d32292",
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 10,
        cursor: "pointer"
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 15
    },
    row: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    
    botaoMais: {
        width: 35,
        height: 35,
        backgroundColor: "#d32292",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: -10,
        cursor: "pointer"
    },
    mais: {
        color: "white",
        fontWeight: "bold",
        fontSize: 25
    },
    image: {
        height: 100,
        width: 100,
        borderRadius: 10
    },
    inputFileRow: {
        marginTop: 20,
        marginBottom: 40
    }
}

export default UploadGaleria;