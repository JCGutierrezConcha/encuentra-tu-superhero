$(document).ready(function () { //Función Ready

    //Tooltips de Bootstrap JS
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    $("form").submit(function (event) {
        event.preventDefault();

        let valueInput = $("#superhero-input").val();
        let errorInput = $("#errorIngreso");
        errorInput.text("");


        //Validación ID de búsqueda
        let inputOk = true;
        let validacionTest = /^[0-9]*$/
        if (valueInput == "") {
            inputOk = false;
            errorInput.text("Debe ingresar un número");
        } else {
            if (validacionTest.test(valueInput) == false) {
                inputOk = false;
                errorInput.text("Debe ingresar solo números");
            }
            else {
                if (valueInput < 1 || valueInput > 731) {
                    inputOk = false;
                    errorInput.text("Debe ingresar un número entre 1 y 731");
                }
            }
        }

        // Carga y despliegue de datos provenientes de la API
        if (inputOk) {
            $.ajax({
                url: "https://superheroapi.com/api.php/4905856019427443/" + valueInput,
                method: "get",
                success: function (response) {
                    //console.log(response)
                    // Creación tarjeta con datos de superheroe
                    $("#superheroCard").html(`
                    <div id="superhero-card" class="card border-dark mb-3" style="max-width: 540px;">
                        <div class="row g-0">
                            <div class="card-header text-center text-white fs-3">
                                SuperHero Encontrado
                            </div>
                            <div class="col-md-4">
                                <img src="${response.image.url}" class="img-fluid rounded-start" alt="...">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body bg-light">
                                    <h5 class="card-title">Nombre: ${response.name}</h5>
                                    <p class="card-text">Conexiones: ${response.connections["group-affiliation"]}</p>
                                </div>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item">Publicado por: ${response.biography.publisher}</li>
                                    <li class="list-group-item bg-light">Ocupación: ${response.work.occupation}</li>
                                    <li class="list-group-item">Primera Aparición: ${response.biography["first-appearance"]}</li>
                                    <li class="list-group-item bg-light">Altura: ${response.appearance.height}</li>
                                    <li class="list-group-item">Peso: ${response.appearance.weight}</li>
                                    <li class="list-group-item bg-light">Alias: ${response.biography.aliases}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `);
                    // Creación de gráfico detorta usando CanvasJS 
                    let chart = new CanvasJS.Chart("superheroChart", {
                        theme: "light1",
                        exportEnabled: true,
                        animationEnabled: true,
                        title: {
                            text: `Estadísticas de poder de ${response.name}`,
                            fontColor: "#273add",
                        },

                        data: [{
                            type: "pie",
                            startAngle: 25,
                            toolTipContent: "<b>{label}</b>: {y}",
                            showInLegend: "true",
                            legendText: "{label}",
                            indexLabelFontSize: 16,
                            indexLabel: "{label} - {y}",

                            dataPoints: [
                                { y: response.powerstats.intelligence, label: "Inteligencia" },
                                { y: response.powerstats.strength, label: "Fuerza" },
                                { y: response.powerstats.speed, label: "Velocidad" },
                                { y: response.powerstats.durability, label: "Durabilidad" },
                                { y: response.powerstats.power, label: "Poder" },
                                { y: response.powerstats.combat, label: "Combate" }
                            ]
                        }]
                    });
                    chart.render();
                },
                error(e) {
                    console.log(e)
                }
            })
        }
    });
});