import React, { useState, useEffect } from "react"
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import ProfileBox from '../profile-box/ProfileBox.js'
// import { profile } from "../../../../server/model/profile.js"

export default () => {

    const [profiles, setProfiles] = useState([])
    const [filter, setFilter] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=>{
    axios.get('/api/profile/approved')
        .then(resp => {
            setIsLoading(false)

            if(resp.data.status === 'success')
                setProfiles(resp.data.message)
        })
        .catch(()=>{
            setIsLoading(false)
            // setMessages({message: 'Įvyko serverio klaida', status: 'danger'})
        })
    }, [])
    const sortAscending = ()=>{
        axios.get('/api/profile/sort/asc')
        .then(resp => {
            setIsLoading(false)

            if(resp.data.status === 'success')
                setProfiles(resp.data.message)
        })
        .catch(()=>{
            setIsLoading(false)
            // setMessages({message: 'Įvyko serverio klaida', status: 'danger'})
        })
    }

    const sortDescending = () => {
        axios.get('/api/profile/sort/desc')
        .then(resp => {
            setIsLoading(false)

            if(resp.data.status === 'success')
                setProfiles(resp.data.message)
        })
        .catch(()=>{
            setIsLoading(false)
            // setMessages({message: 'Įvyko serverio klaida', status: 'danger'})
        })
    }
    const List = () => {
        return profiles.map((value, index)=>(
            <ProfileBox key={index} profile={value}/>
        ))
    }

    const ListAbove = () => {
        return profiles.map((value, index)=>{
            if(value.success === 0){
                return <ProfileBox key={index} profile={value}/>
            }
        })
    }

    const ListBelow = () => {
        return profiles.map((value, index)=>{
            if(value.success === 1){
                return <ProfileBox key={index} profile={value}/>
            }
        })
    }

    const ListContainer = () =>{
        return(
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 pt-5">
             {/* <List /> */}
             <ListAbove />
             <ListBelow />
             </div>
        )
    }

    // const Filter = () => {
    //     return(
    //     <div className="Filter">
    //         <label>Filtravimas pagal valandinį įkainį:</label>
    //         <input type="number" min="0" value={filter} onChange={e=> handleFilterChange(e)}/>
    //         <button onClick={handleFilter}>Filtruoti</button>
    //     </div>
    //     )
    // }

    const handleFilterChange = (e)=>{
        setFilter(e.target.value)
    }

    const handleFilter = () =>{
        setIsLoading(true)
        axios.get('/api/profile/filter/hourly_rate/' + filter)
        .then(resp => {
            setIsLoading(false)

            if(resp.data.status === 'success')
                setProfiles(resp.data.message)
        })
        .catch(()=>{
            setIsLoading(false)
            // setMessages({message: 'Įvyko serverio klaida', status: 'danger'})
        })
    }

    return(
        <Container>
            <h1>Labdaringos idėjos ieško jūsų paramos:</h1>
            {isLoading ?
             'Duomenys kraunasi...':(
                 <>
                    {/* <Filter /> */}
                    {/* <div className="Filter">
                        <label>Filtravimas pagal valandinį įkainį:</label>
                        <input type="number" min="0" value={filter} onChange={e=> handleFilterChange(e)}/>
                        <button onClick={handleFilter}>Filtruoti</button>
                    </div>
                    <div className="sorting">
                        <button className="btn btn-primary mt-3" onClick={sortAscending}>Didėjančia tvarka</button>
                        <button className="btn btn-primary mt-3" onClick={sortDescending}>Mažėjančia tvarka</button>
                    </div> */}
                    <ListContainer />
                </>
             )
             }
        </Container>
    )
}