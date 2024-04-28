//! Leomar Salazar

import './App.css';
import { useEffect, useState } from 'react';

function App() {

const [allUsers, setAllUsers] = useState([]);
const [originalOrder, setOriginalOrder] = useState([])
const [alternateColor, setAlternateColor] = useState(false);
const [altenateSort, setAlternateSort] = useState(true);
const [filterText, setFilterText] = useState('');

const fetchUsers = async () => {
  try {
    const response = await fetch('https://randomuser.me/api/?results=100&inc=name,nat,picture');
    if (!response.ok) {
      throw new Error('err!!!!');
    }
    const data = await response.json();
    //Creo un array de objetos con los datos recibidos de la API
    const users = data.results.map((x) => ({
      img: x.picture.thumbnail,
      firstName: x.name.first,
      lastName: x.name.last,
      nationality: generateCountryName(x.nat)
    }));
    //Asigno el array a allUsers
    setAllUsers(users);
    //También a originalOrders para tener claro el orden incial del array poder restablecerlo.
    setOriginalOrder(users)
  } catch (error) {
    return []
  }
};

// Función a llamar al clickear el boton eliminar. 
const deleteUser = (index) => {
  //Creo una copia del array allUsers para manipularlo eliminando el usuario según su indice.
  const updatedUsers = [...allUsers.slice(0, index), ...allUsers.slice(index + 1)];
  //Asigno el array copia al array allUser y originalOrder.
  setAllUsers(updatedUsers);
  setOriginalOrder(updatedUsers);
};

/*Esta funcion es llamana en la linea 24, en el fetch, para traducir el codigo de país en formato ISO a su nombre
en español. */
const generateCountryName = (isoCode) => {
  let countrys = new Intl.DisplayNames(['es'], {type: 'region'})
  return countrys.of(isoCode)
}

/*Función para intercalar el color de la tabla. Es un boolean y en base a si es true o false se
habilita una condicional que cambia la clase de las diferentes filas de la tabla. */
const toggleAlternateColor = () => {
  setAlternateColor(prevState => !prevState);
};

/*De la misma forma, esta funciónes un boolean. Según si es true o false llama una función o devuelve allUsers
a su estado original */
const orderButton = () => {
  setAlternateSort(prevState => !prevState);
  if (altenateSort) {
    sortByCountry();
  } else {
    setAllUsers(originalOrder);
  }
};

/* sortByCountry como su nombre lo indica filtra las filas por país. Se copia el array mediante spread operator 
para crear una copia de allUsers de manera segura, luego con el metodo .sort() se ordena el array en base a la propiedad
nationality. Antes de convertir allUsers en allUsersSorted, respaldo la variable usando serOriginalOrder y pasando
allUsers. De esta forma garantizo que puedo volver al orden original llamando a originalOrder. */
const sortByCountry = () => {
  const allUsersSorted = [...allUsers];
  allUsersSorted.sort((a,b) => a.nationality.localeCompare(b.nationality));
  setOriginalOrder(allUsers)
  setAllUsers(allUsersSorted)
};

/* La función filterUser reduce la lista que se muestra en base al argumento text. De esta forma se puede buscar
usuarios por su nombre, apellido o nacionalidad. */
const filterUsers = (text) => {
  const filteredUsers = originalOrder.filter(user =>
    user.firstName.toLowerCase().includes(text.toLowerCase()) ||
    user.lastName.toLowerCase().includes(text.toLowerCase()) ||
    user.nationality.toLowerCase().includes(text.toLowerCase())
  );
  setAllUsers(filteredUsers);
};

/* Las siguientes tres funciones se llaman en un onClick en cada header de la tabla y ordenan en orden alfabetico
según la columna que representan. También se usa el metodo .sort() */
const sortByFirstName = () => {
  const sortedUsers = [...allUsers].sort((a, b) => {
    return a.firstName.localeCompare(b.firstName);
  });
  setAllUsers(sortedUsers);
};

const sortByLastName = () => {
  const sortedUsers = [...allUsers].sort((a, b) => {
    return a.lastName.localeCompare(b.lastName);
  });
  setAllUsers(sortedUsers);
};

const sortByNationality = () => {
  const sortedUsers = [...allUsers].sort((a, b) => {
    return a.nationality.localeCompare(b.nationality);
  });
  setAllUsers(sortedUsers);
};

// Se llama la función fetchUsers() al iniciar la aplicación.
  useEffect(() => {
    fetchUsers();
  }, []);

  
  return (
    <div className="App">
      <h1>Lista de usuarios</h1>
      <header className='filterButtonsContainer'>
        <button className='filterButton' onClick={toggleAlternateColor}>Cambiar Color</button>
        <button className='filterButton' onClick={orderButton}>Ordenar por país</button>
        <button className='filterButton' onClick={() => {
          // Devuelve todos los estados a sus valores originales. En el caso de allUsers a través de originalOrder.
          setAlternateColor(false) 
          setAllUsers(originalOrder)
          setFilterText("");
          }}>Restaurar</button>
        <input type='text' name='countryFilter' className='countryFilter' value={filterText} onChange={(event)=>{
          /* Primero se obtiene el valor del input cada vez que se cambia el texto. Luego, se cambia el valor de
          filterText con setFilterText, que al mismo tiempo es el valor que se muestra siempre en el input 
          (con value={filterText}). Luego se ejecuta la función filterUsers que termina modificando allUsers, el
          array que finalmente se muestra en la tabla. */
          const text = event.target.value;
          setFilterText(text);
          filterUsers(text);
        }} />
      </header>
      <table className='userTable'>
        <thead className='tableColumns'>
          <tr className='tableColumnsHeader'>
            <th>Foto</th>
            <th onClick={() => sortByFirstName()}>Nombre</th>
            <th onClick={() => sortByLastName()}>Apellido</th>
            <th onClick={() => sortByNationality()}>Nacionalidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user, index) => (
            /* Condicional que se ejecuta solo si alternateColor está en true, de no ser así, se le asigna como clase a 
            todas las filas "userRow" */
            <tr key={index} className={alternateColor ? (index % 2 === 0 ? "userRowEven" : "userRowOdd") : "userRow"}>
              <td><img src={user.img} height={48} width={48} style={{borderRadius: 50}}/></td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.nationality}</td>
              <td><button className='deleteButton' onClick={() =>{ deleteUser(index)}}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
