module.exports = {
  beforeCreate(event) {
    const { data } = event.params;
    
    if (!data.report_time) {
      data.report_time = new Date();
    }
    if (!data.denunciation_status) {
      data.denunciation_status = 'Aguardando Resposta';
    }
    
    if (data.position && !data.position.type) {
      data.position = {
        type: 'Point',
        coordinates: [
          parseFloat(data.position.longitude || 0),
          parseFloat(data.position.latitude || 0)
        ]
      };
    }
  }
};