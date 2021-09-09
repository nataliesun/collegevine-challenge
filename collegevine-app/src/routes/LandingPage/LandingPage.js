import { Button, Form, ListGroup } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import CollegeApiService from '../../services/college-api-service';

function LandingPage() {
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    function success(pos) {
      const { coords } = pos;

      setLat(coords.latitude);
      setLon(coords.longitude);
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
  });

  const handleChangeLat = (ev) => {
    setLat(ev.currentTarget.value);
  };

  const handleChangeLon = (ev) => {
    setLon(ev.currentTarget.value);
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();

    CollegeApiService.getCollegesByDistance({ lat, lon }).then((resJson) =>
      setColleges(resJson),
    );
  };

  return (
    <main className='mx-3 mt-5'>
      <h1>Find colleges by distance</h1>
      <Form>
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='lat'>Latitude</Form.Label>
          <Form.Control
            value={lat}
            className='mb-3'
            onChange={handleChangeLat}
            id='lat'
          />
          <Form.Label htmlFor='lon'>Longitude</Form.Label>
          <Form.Control value={lon} onChange={handleChangeLon} id='lon' />
          <Button className='mt-3' onClick={handleSubmit}>
            Submit
          </Button>
        </Form.Group>
      </Form>
      <div>
        <ListGroup>
          {colleges &&
            colleges.map((college) => {
              return (
                <ListGroup.Item key={college.name}>
                  <p>Name: {college.name}</p>
                  <p>State: {college.address__state}</p>
                  <p>City: {college.address__city}</p>
                  <p className='mb-0'>
                    Distance: {Math.round(college.distance)} miles
                  </p>
                </ListGroup.Item>
              );
            })}
        </ListGroup>
      </div>
    </main>
  );
}

export default LandingPage;
