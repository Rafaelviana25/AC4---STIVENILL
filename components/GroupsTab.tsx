
import React from 'react';
import { WHATSAPP_GROUPS } from '../constants';

const GroupsTab: React.FC = () => {
  const handleContact = (phone: string, name: string) => {
    const message = encodeURIComponent(`Olá, gostaria de solicitar acesso ao grupo AC4: ${name}.`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
        <div className="flex items-center mb-4">
          <i className="fab fa-whatsapp text-green-500 text-2xl mr-3"></i>
          <h2 className="text-lg font-bold text-gray-800">Grupos de AC4 no WhatsApp</h2>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-start">
            <i className="fas fa-info-circle text-green-600 mt-1 mr-2"></i>
            <span className="text-sm text-green-800">
              Entre em contato com os administradores oficiais para solicitar acesso aos grupos de serviço.
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
          <h3 className="font-semibold flex items-center">
            <i className="fab fa-whatsapp mr-2"></i>
            Grupos Disponíveis
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {WHATSAPP_GROUPS.map((group) => (
            <div key={group.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <h4 className="font-bold text-gray-800">{group.name}</h4>
                <p className="text-xs text-gray-500">Adm: {group.admin}</p>
              </div>
              <button 
                onClick={() => handleContact(group.phone, group.name)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center shadow-sm transition-transform active:scale-95"
              >
                <i className="fab fa-whatsapp mr-2"></i>
                Contatar
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
        <h4 className="text-sm font-bold text-green-800 mb-2 flex items-center">
          <i className="fas fa-comments mr-2"></i>
          Dicas de Contato
        </h4>
        <ul className="text-xs text-green-700 space-y-2">
          <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2"></i> Seja educado e objetivo ao solicitar acesso.</li>
          <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2"></i> Mencione seu interesse em participar do turno AC4.</li>
          <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2"></i> Aguarde o retorno do administrador.</li>
        </ul>
      </div>
    </div>
  );
};

export default GroupsTab;
