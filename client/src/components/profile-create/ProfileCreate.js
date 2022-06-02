import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import React, {useState} from 'react'
import Alert from 'react-bootstrap/Alert'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const userid = 4 // Statinis userio ID

export default ()=>{

    const [profileForm, setProfileForm] = useState({
        // headline:'',
        // subheadline: '',
        description: '',
        profile_image: '',
        target_sum: ''
        // hourly_rate: 5,
        // location: ''
    })

    const [messages, setMessages] = useState({message: '', status: ''})
    const navigate = useNavigate()

    const handleInputChange = (e) =>{
        setProfileForm({
            ...profileForm,
            [e.target.name]:e.target.value
        })
    }

    const handleValidation = () =>{
        for(let index of Object.keys(profileForm)){
            if(index === 'hourly_rate' && profileForm[index]< 0)
                return false
            if(profileForm[index] === ''){
                return false
            }
        }
        return true    
    }

    const handleSubmit = (e) =>{
        e.preventDefault()
        
        // if(!handleValidation()){
        //     setMessages({message: 'Netinkamai užpildyta forma', status: 'danger'})
        //     return false
        // }

        // profileForm.UserId = userid

        axios.post('/api/profile/create/', profileForm)
        .then(resp => {
            console.log(resp.data)
            if(resp.data.status === 'success'){
                setTimeout( ()=> {
                    navigate('/')
                }, 2000)
            }else{
                setMessages({message: resp.data.message, status: resp.data.status})
            }
        })
        .catch(()=>{
            setMessages({message: 'Įvyko serverio klaida', status: 'danger'})
        })
    }

    return(
    <Container>
        <div className="profileCreate">
            <h1>Labdaros idėjos registravimas</h1>
            {messages.message && (
                <Alert variant={messages.status}>{messages.message}</Alert>
            )}
            <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Labdaringos idėjos pristatymas</label>
                <textarea className="form-control" name="description" rows="6" value={profileForm.description} onChange={(e)=>handleInputChange(e)}></textarea>
            </div>
            <div className="mb-3">
                <label className="form-label">Labdaringos idėjos paveikslėlis</label>
                <input type="file" className="form-control" name="profile_image" value={profileForm.profile_image} onChange={(e)=>handleInputChange(e)}/>
            </div>
            <div className="mb-3">
                <label className="form-label">Reikalinga finansavimo suma</label>
                <input type="number" name="target_sum" className="form-control" min="0" value={profileForm.target_sum} onChange={(e)=>handleInputChange(e)} />
            </div>
            <Button type="submit" variant="primary">Kurti profilį</Button>
            </form>
        </div>
    </Container>
    )
}