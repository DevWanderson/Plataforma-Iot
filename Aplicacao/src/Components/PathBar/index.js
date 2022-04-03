import React from 'react'
//import useBreadcrumbs from 'use-react-router-breadcrumbs';
import { Link } from 'react-router-dom'
import Breadcrumbs from '@material-ui/core/Breadcrumbs';  
import './styles.css'
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

export default function PathBar() {
  const styles = makeStyles({
    root: {
      fontSize: '12pt',
    },
    link: {
      color: '#2451ed',
    },
    active: {
      color: '#0462c5',
    }
  });

  const classes = styles()

  const routes = [
    { path: '/dispositivos-cadastrados', breadcrumb: 'Dispositivos cadastrados' },
    { path: '/dispositivos-cadastrados/descricao', breadcrumb: 'Descrição' },
    { path: '/dispositivos-cadastrados/cadastroEverynet', breadcrumb: 'Cadastro - Everynet' },
    { path: '/dispositivos-cadastrados/cadastroMqtt', breadcrumb: 'Cadastro - Mqtt' },
    { path: '/dados-do-dispositivo', breadcrumb: 'Telemetria' },
    { path: '/dispositivos-cadastrados/cadastroEverynet/cadastroTipo', breadcrumb: 'Cadastro de Tipo' }
  ];

  let cont = 1
  //const breadcrumbs = useBreadcrumbs(routes);

  /* return (
    <Breadcrumbs aria-label="breadcrumb" separator="›" className="pathBar">
      {breadcrumbs.map(({
        match,
        breadcrumb
      }, index) => (
        <span key={match.url}>
          <Link className={clsx(classes.root, (breadcrumbs.length - 1) == index ? classes.active : classes.link)} color="textPrimary" to={match.url}>{breadcrumb}</Link>
        </span>
      ))}
    </Breadcrumbs>
  ); */
}

//reference: https://www.npmjs.com/package/use-react-router-breadcrumbs