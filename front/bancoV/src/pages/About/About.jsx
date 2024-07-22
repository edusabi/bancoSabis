import Style from "./About.module.css"

const About = () => {
  return (
    <div className={Style.div}>
        <h1>Sobre nós da BancoSabis</h1>
        <ol>
          <li>Somos os melhores do mercado.</li>
          <li>Melhor atendimento do Brasil.</li>
        </ol>
    </div>
  )
}

export default About