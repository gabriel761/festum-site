
import verifyErrorCode from "../services/verifyErrorCode";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "../services/firebase"
import  "firebase/compat/auth";
import { auth } from "../services/firebase";
import api from "../api/api";


let message = ''
let isLoading = false
export const efetuarCriarFornecedorFicticio = async (values) => {
  console.log("values dentro do efetuar cadastro: ", values)
  try {
    let newValues = values
    //newValues = { ...values, firebaseId: userCredential.user.uid }
    console.log("subindo foto de perfil...")
    newValues = await uploadImageToFirebase(newValues)
    console.log("subindo fotos da galeria...")
    console.log("new values: ", newValues)
    if(newValues.galeria.length > 0){
      newValues = await uploadGaleryToFirebase(newValues)
    }
    console.log("upload foto fundo: ", newValues.imagemFundo)
    if(newValues.imagemFundo.length > 0){
      newValues = await uploadFotoFundo(newValues)
    }
    console.log("enviando dados ao back-end...")
    console.log("imagem fundo: ", newValues)
    newValues = await sendToBackEnd(newValues)
      await auth.createUserWithEmailAndPassword(values.email, values.senha)
    let currentUser = auth.currentUser
    console.log("current user cadastro cliente: ", currentUser)
    await updateFirebaseId(currentUser.uid, currentUser.email)
    auth.signOut()
    

    return { message, isLoading }
  } catch (e) {
    console.log(e)
    message = verifyErrorCode(e.code)
    return { message, isLoading }

  }

  
}
// função para fazer upload da imagem ao firebase
const uploadImageToFirebase = async (newValues) => {
  try {
    let imageUri = newValues.imagem
    delete newValues.imagem
    const response = await fetch(imageUri)
    const blob = await response.blob()
    const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1)
    const storageRef = ref(storage, "perfilFornecedor/" + filename)
    const metadata = await uploadBytes(storageRef, blob)
    const url = await getDownloadURL(metadata.ref)
    console.log(url)
    const newValues2 = { ...newValues, imagem: url }
    // send to back-end precisa ficar aqui pois é necessário pegar a url do upload da foto
    return newValues2
  } catch (e) {
    isLoading = false
    console.log("image url error: ", e)
  }

}
const uploadFotoFundo = async (newValues) => {
  try {
    let imageUri = newValues.imagemFundo
    delete newValues.imagemFundo
    const response = await fetch(imageUri)
    const blob = await response.blob()
    const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1)
    const storageRef = ref(storage, "fundo/" + filename)
    const metadata = await uploadBytes(storageRef, blob)
    const url = await getDownloadURL(metadata.ref)
    console.log(url)
    const newValues2 = { ...newValues, fotoFundo: url}
    // send to back-end precisa ficar aqui pois é necessário pegar a url do upload da foto
    return newValues2
  } catch (e) {
    isLoading = false
    console.log("image url error: ", e)
  }

}
const uploadGaleryToFirebase = async (newValues) => {
  const galeria = newValues.galeria
  let newGaleria = []
  newGaleria = await Promise.all( galeria.map(async item => {
      let url = ""
      url =  await upload(item)
      console.log("galeria url: ", url)
      return url
  }));
  console.log("galeria após upload: ",newGaleria)
  newValues.galeria = JSON.stringify(newGaleria) 
 return newValues

}

  const upload = async (imageUri) => {
    try {
      const response = await fetch(imageUri)
      const blob = await response.blob()
      const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1)
      const storageRef = ref(storage, "galery/" + filename)
      const metadata = await uploadBytes(storageRef, blob)
      const url = await getDownloadURL(metadata.ref)
      return url
    } catch (e) {
      isLoading = false
      console.log("image url error: ", e)
    }
  }

const sendToBackEnd = async (values) => {
  try {
    let result = await api.request({
      url: "/addFornecedor",
      data: values,
      method: "POST"
    })
    if (Object.keys(result.data).length == 0) {
      // se for copiar para cadastro de cliente preste atenção nesta mensagem
      message = "Sem resposta do servidor"
      console.log("result data is empty")

      
    } else {
      if (!result.data.error) {
        message = "Estamos enviando um email de confirmação, aguarde...."

        
        // haverá um login automático mas como o email ainda não foi confirmado a tela de confirmação de e-mail vai abrir
        // remover qualquer usuário do async storage
        
        // avisar ao app que o proximo login será o login de um usuário que acabou de ser cadastrado. É só para não abrir o introSlider de novo. 
        
      } else {

        //await auth().currentUser.delete()
      }
    }
  } catch (e) {
    
 
    message = "Sem resposta do servidor"
    console.log("erro do axios: ", e)
  }
  
}
const updateFirebaseId = async (uid, email) => {
  try{
    let result = await api.request({
      url: "/updateFirebaseId/"+uid+"/"+email,
      method: "GET"
    })
  }catch(e){
    console.log("erro no update firebase id", e)
  }
 
}