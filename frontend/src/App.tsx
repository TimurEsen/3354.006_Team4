//import { useState } from 'react'
import './App.css'
import Calander from "./assets/Calander.tsx";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function App() {
    return (
        <>
            <Calander/>
            {newProjectModal()}
        </>
    )

    /*const [count, setCount] = useState(0)

    return (
      <>
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </>
    )*/
}

function newProjectModal() {

    async function createPost(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        interface AppointmentData {
            'tz': string;
            'start-date': string;
            'end-date': string;
            'start-time': string;
            'end-time': string;
            'title': string;
            'description': string;
        }

        const data: AppointmentData = {
            'tz':(Intl.DateTimeFormat().resolvedOptions().timeZone),
            'start-date': (document.getElementById('start-date') as HTMLInputElement)?.value ?? '',
            'end-date': (document.getElementById('end-date') as HTMLInputElement)?.value ?? '',
            'start-time': (document.getElementById('start-time') as HTMLInputElement)?.value ?? '',
            'end-time': (document.getElementById('end-time') as HTMLInputElement)?.value ?? '',
            'title': (document.getElementById('title-input') as HTMLInputElement)?.value ?? '',
            'description': (document.getElementById('descriptions-text') as HTMLTextAreaElement)?.value ?? '',
        };

        /*const formData = new FormData();
        (Object.keys(data) as (keyof AppointmentData)[]).forEach(key => {
            formData.append(key, data[key]);
        });*/
        const formData = JSON.stringify(data);
        console.log(formData)

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log("Post successful!");
            console.log("Full Response:", response);

        } catch (error) {
            // TypeScript infers the error type here (often 'unknown')
            console.error("Failed to create post:", error);
        }
    }
    return (
        <>
            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newProjectModal">+
            </button>

            <div className="modal fade" id="newProjectModal" aria-labelledby="exampleModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable modal-lg modal-fullscreen-sm-down">
                    <div className="modal-content">
                        <form id="new-project-form" className="needs-validation" method="post" onSubmit={createPost}>
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Make New Event</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div>
                                    <div className="d-flex pb-2">
                                        <div className={'p-2'}>
                                            <label id="starts-label" htmlFor="start-date" className="form-label p-2">
                                                Start: </label>
                                            <input type="date" name="date-field-name" id="start-date"/>
                                        </div>
                                        <div className={'p-2'}>
                                            <input id="start-time" type={'time'}/>
                                        </div>
                                    </div>
                                    <div className="d-flex pb-2">
                                        <div className={'p-2'}>
                                            <label id="ends-label" htmlFor="end-date" className="form-label p-2">
                                                End: </label>
                                            <input type="date" name="date-field-name" id="end-date"/>
                                        </div>
                                        <div className={'p-2'}>
                                            <input id="end-time" type={'time'}/>
                                        </div>
                                    </div>


                                    <div className="input-group">
                                        <span className="input-group-text"
                                              id="title-input-label">Title</span>
                                        <input type="text" className="form-control" id="title-input" required
                                               aria-describedby="title-input title-subtext"/>
                                    </div>

                                    <div className="mb-3">
                                        <label id="description-label" htmlFor="descriptions-text"
                                               className="form-label">
                                            Descriptions</label>
                                        <textarea className="form-control" id="descriptions-text"></textarea>
                                    </div>
                                </div>


                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>

    )
}

export default App
