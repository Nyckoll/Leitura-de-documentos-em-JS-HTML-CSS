function readSingleFile(evt) {
    const f = evt.target.files[0];
    if (f) {
        const r = new FileReader();
        r.onload = function (e) {
            const contents = e.target.result;

            const materias1 = (linha) => {
                const informacoes = linha.split(',');
                const teste = {
                    ano_periodo: informacoes[0],
                    códigoDisciplina: informacoes[1],
                    CH: parseInt(informacoes[2]),
                    Freq: parseFloat(informacoes[3]),
                    Nota: parseFloat(informacoes[4]),
                };
                return teste;
            }
            const linhas = (contents) => {
                return (contents.split('\n').map(x => materias1(x)))
            }
            console.log(linhas(contents))
            let materias = linhas(contents)


            const periodos = (materias) => materias.map(materias => materias.ano_periodo)
            const tiraRepetido = (periodos) => periodos.filter((atual, depois) => periodos.indexOf(atual) == depois)

            const tempo_periodo = () => {
                const periodo = tiraRepetido(periodos(materias))
                return periodo.length
            }
            //MÉDIA PONDERADA CH

            const peso = (materias) => materias.map(materias => materias.CH / 15)
            const nota1 = (materias) => materias.map(materias => materias.Nota * (materias.CH / 15))

            const somatorio_notas = nota1(materias).reduce((resultado, quantidade) => {
                return (resultado + quantidade);
            }, 0);

            const somatorio_pesos = peso(materias).reduce((resultado, peso) => {
                return (resultado + peso)
            }, 0);

            const media = (somatorio_notas / somatorio_pesos).toFixed(2)


            //DESVIO PADRÃO DA MÉDIA

            const DP_notas = (materias, media) => materias.map(materias => (materias.Nota - media) ** 2)

            const quantidadeNotas = DP_notas(materias, media).length

            const somatorioDP = DP_notas(materias, media).reduce((resultado, quantidade) => {
                return (resultado + quantidade)
            })

            const resultado = Math.sqrt(somatorioDP / quantidadeNotas).toFixed(2)


            //LISTA DE DISCIPLINAS COM APROVAÇÃO

            const disciplinasAprovadas = materias.filter(materias => materias.Nota >= 5)
            const nomeAprovados = (disciplinasAprovadas) => disciplinasAprovadas.map(disciplinasAprovadas => disciplinasAprovadas.códigoDisciplina)

            // LISTA DE DISCIPLINAS REPROVADOS

            const disciplinasReprovados = materias.filter(materias => (materias.Nota < 5))
            const nomeReprovados = (disciplinasReprovados) => disciplinasReprovados.map(disciplinasReprovados => disciplinasReprovados.códigoDisciplina)

            // CARGA HORARIA TOTAL

            const CHaprovadas = (disciplinasAprovadas) => disciplinasAprovadas.map(disciplinasAprovadas => (disciplinasAprovadas.CH))

            const CHtotal = CHaprovadas(disciplinasAprovadas).reduce((resultado, quantidade) => {
                return (resultado + quantidade)
            }, 0)


            // CARGA HORARIA DAS DISCIPLINAS POR DEPARTAMENTO 

            const separaDepartamento = (dep) => dep.slice(0, -4)

            const dep = (materias) => materias.map(materia => separaDepartamento(materia.códigoDisciplina))

            const dep_final = tiraRepetido(dep(materias))

            const mat_dep = (dep) => materias.filter(materias => separaDepartamento(materias.códigoDisciplina) == dep)

            const peso_mat_dep = (dep) => peso(mat_dep(dep))
            const nota_mat_dep = (dep) => nota1(mat_dep(dep))

            const somatorio_notas_dep = (dep) => nota_mat_dep(dep).reduce((resultado, quantidade) => {
                return (resultado + quantidade);
            }, 0);

            const somatorio_pesos_mat_dep = (dep) => peso_mat_dep(dep).reduce((resultado, peso) => {
                return (resultado + peso);
            }, 0);

            const media_dep = (count = 0) => {
                if (count == dep_final.length) return ''
                else return `MÉDIA ${dep_final[count]}: ${somatorio_notas_dep(dep_final[count]) / somatorio_pesos_mat_dep(dep_final[count])}\n` + media_dep(count + 1)
            }


            alert(
                "Períodos: " + tempo_periodo() + "\r\n" +
                "Média Ponderada CH: " + media + "\r\n" +
                "Desvio Padrão da Média: " + resultado + "\r\n"
            );
        }
        r.readAsText(f);
    } else {
        alert("Falhou em abrir arquivo!");
    }
    const reader = new FileReader();
    reader.onload = function (e) {
        const dataURL = reader.result;
    }
    reader.readAsDataURL(f);
}


document.getElementById('fileinput').addEventListener('change', readSingleFile, false);