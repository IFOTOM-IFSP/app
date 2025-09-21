import TitleSection from "@/src/components/common/TitleSection";
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import { ThemedText } from "@/src/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  Margin,
  Padding,
} from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { Image } from "expo-image";
import {
  ChevronDown,
  ExternalLink,
  FlaskConical,
  Lightbulb,
  ListChecks,
  Puzzle,
  Wrench,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

// Habilita LayoutAnimation no Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Interfaces ---
interface GuideLink {
  label: string;
  url: string;
}

interface GuideStep {
  title: string;
  imageUrl: string;
  difficulty: "Iniciante" | "Intermediário";
  principle: string;
  quickTip: string;
  applications: string[];
  materials: string[];
  instructions: string[];
  links: GuideLink[];
}

// --- DADOS COMPLETOS E ENRIQUECIDOS (COM OS 4 TIPOS) ---
const quickGuideContent: GuideStep[] = [
  {
    title: "Smartphone Light Sensor",
    imageUrl:
      "https://pubs.acs.org/cms/10.1021/acs.jchemed.7b00548/asset/images/medium/ed-2017-00548s_0005.gif",
    difficulty: "Iniciante",
    principle:
      "Utiliza o sensor de luz ambiente do celular para medir a intensidade da luz que passa por uma fenda, sem decompor a luz em um espectro.",
    quickTip:
      "Para melhores resultados, realize as medições em um ambiente o mais escuro possível para evitar interferência de luz externa.",
    applications: [
      "Demonstração da Lei de Beer-Lambert.",
      "Medição de turbidez em líquidos.",
      "Análise de concentração de soluções coloridas.",
    ],
    materials: [
      "Peças impressas em 3D",
      "Smartphone com sensor de luz",
      "Fenda de entrada (papel alumínio)",
      "Tubo para alinhar a luz",
      "Fita adesiva ou cola",
    ],
    instructions: [
      "Baixe e imprima as peças 3D do Thingiverse.",
      "Monte a carcaça principal.",
      "Construa uma fenda de entrada estreita (~1 mm).",
      "Insira a fenda no suporte impresso.",
      "Alinhe o tubo para a luz atingir o sensor.",
      "Fixe as partes, evitando vazamento de luz.",
      "Teste com diferentes fontes de luz e registre dados.",
      "Analise a intensidade de luz captada.",
    ],
    links: [
      {
        label: "Artigo ACS",
        url: "https://pubs.acs.org/doi/10.1021/acs.jchemed.7b00548",
      },
      {
        label: "Arquivos 3D (Thingiverse)",
        url: "https://www.thingiverse.com/thing:3185420",
      },
    ],
  },
  {
    title: "SpecPhone",
    imageUrl:
      "https://pubs.acs.org/cms/10.1021/acs.jchemed.5b00654/asset/images/medium/ed-2015-00654g_0009.gif",
    difficulty: "Intermediário",
    principle:
      "Usa uma grade de difração para separar a luz em um espectro, que é capturado pela câmera do celular, permitindo uma análise por comprimento de onda.",
    quickTip:
      "A calibração com uma fonte de luz conhecida (como uma lâmpada fluorescente) é crucial para obter comprimentos de onda precisos.",
    applications: [
      "Análise de espectros de emissão de LEDs.",
      "Estudo da composição de corantes.",
      "Verificação de autenticidade de azeites (avançado).",
    ],
    materials: [
      "Carcaça impressa em 3D",
      "Fonte de luz (LED)",
      "Fendas removíveis",
      "Cuveta de 1 cm",
      "Espelho de alumínio",
      "Grade de difração",
      "Smartphone com câmera",
      "Software ImageJ",
    ],
    instructions: [
      "Imprima a carcaça do SpecPhone.",
      "Fixe o espelho a 45° no suporte.",
      "Insira a grade de difração perto da câmera.",
      "Posicione a fenda em frente à luz.",
      "Coloque a cuveta no local indicado.",
      "Ajuste o smartphone para registrar o espectro.",
      "Calibre com uma fonte de luz conhecida.",
      "Capture e processe as imagens no ImageJ.",
    ],
    links: [
      {
        label: "Artigo ACS",
        url: "https://pubs.acs.org/doi/10.1021/acs.jchemed.5b00654",
      },
    ],
  },
  {
    title: "Espectrofotômetro de Papel",
    imageUrl:
      "https://pubs.acs.org/cms/10.1021/acsomega.0c05123/asset/images/medium/ao0c05123_0005.gif",
    difficulty: "Iniciante",
    principle:
      "Um fragmento de DVD atua como grade de difração, decompondo a luz ambiente ou de um LED. A câmera do celular captura o espectro resultante.",
    quickTip:
      "Um pedaço de DVD de boa qualidade (sem muitos arranhões) funciona melhor como grade de difração, gerando um espectro mais nítido.",
    applications: [
      "Análise qualitativa de cores.",
      "Ensino de conceitos de difração da luz.",
      "Identificação de picos de absorção de pigmentos vegetais.",
    ],
    materials: [
      "Papel laminado ou cartolina",
      "Fragmento de DVD",
      "Mini LED (opcional)",
      "Cuvetas padrão de 1 cm",
      "Filtros coloridos (opcionais)",
      "Smartphone com câmera",
      "Softwares Light Analyzer e ImageJ",
    ],
    instructions: [
      "Recorte e monte a estrutura de papel.",
      "Crie uma fenda de entrada estreita (~3x1 mm²).",
      "Fixe o fragmento de DVD como grade de difração.",
      "Instale um suporte para a cuveta.",
      "Adicione filtros coloridos, se necessário.",
      "Posicione o smartphone alinhado à grade.",
      "Use luz ambiente ou um LED para iluminar.",
      "Capture e processe as imagens no ImageJ.",
    ],
    links: [
      {
        label: "Artigo ACS",
        url: "https://pubs.acs.org/doi/10.1021/acsomega.0c05123",
      },
    ],
  },
  {
    title: "Papercraft Spectrometer",
    imageUrl:
      "https://wsrv.3dprinterfiles.com/?url=https://cdn.thingiverse.com/assets/e0/c2/7d/52/50/large_display_bee850f7-ee23-40d9-a85f-e8acd1f36d96.jpg&w=640&h=640&output=webp&q=100&n=40",
    difficulty: "Iniciante",
    principle:
      "É um espectroscópio visual simples. A luz entra por uma fenda, é decomposta por uma grade de difração (DVD) e o espectro pode ser visto a olho nu.",
    quickTip:
      "Aponte para fontes de luz brilhantes e variadas (Sol, lâmpadas, tela do PC) para ver as diferenças claras nos espectros de emissão.",
    applications: [
      "Visualização de espectros de diferentes fontes de luz.",
      "Ferramenta educacional para óptica.",
      "Observação de linhas de absorção de Fraunhofer (avançado).",
    ],
    materials: [
      "Papel/cartolina rígida",
      "Tesoura e cola",
      "Fragmento de DVD",
      "Smartphone com câmera (ou observação a olho nu)",
    ],
    instructions: [
      "Baixe e imprima o molde em papel ou cartolina.",
      "Recorte as partes indicadas.",
      "Dobre e cole para formar a estrutura.",
      "Insira o pedaço de DVD inclinado.",
      "Construa uma pequena fenda para a luz.",
      "Alinhe o smartphone ou olhe através da saída.",
      "Capture imagens ou analise o espectro visualmente.",
    ],
    links: [
      {
        label: "Arquivos Papercraft",
        url: "https://3dgo.app/models/thingiverse/6622544",
      },
    ],
  },
];

// --- Componentes Reutilizáveis ---

const Tag = ({
  text,
  color,
  backgroundColor,
}: {
  text: string;
  color: string;
  backgroundColor: string;
}) => (
  <View style={[styles.tag, { backgroundColor }]}>
    <ThemedText style={[styles.tagText, { color }]}>{text}</ThemedText>
  </View>
);

const InfoSection = ({
  title,
  content,
  icon: Icon,
  color,
}: {
  title: string;
  content: string | string[];
  icon: React.ElementType;
  color: string;
}) => (
  <View style={styles.infoSectionContainer}>
    <Icon color={color} size={20} style={styles.infoIcon} />
    <View style={{ flex: 1 }}>
      <ThemedText style={[styles.subHeader, { color }]}>{title}</ThemedText>
      {Array.isArray(content) ? (
        content.map((item, i) => (
          <ThemedText key={i} style={styles.listItem}>
            • {item}
          </ThemedText>
        ))
      ) : (
        <ThemedText style={styles.listItem}>{content}</ThemedText>
      )}
    </View>
  </View>
);

const AccordionItem = ({
  item,
  isExpanded,
  onPress,
}: {
  item: GuideStep;
  isExpanded: boolean;
  onPress: () => void;
}) => {
  const cardBackgroundColor = useThemeValue("card");
  const headingColor = useThemeValue("text");
  const primaryColor = useThemeValue("primary");
  const textColor = useThemeValue("textSecondary");
  const separatorColor = useThemeValue("text");
  const tagBgColor = useThemeValue("card");
  const tagTextColor = useThemeValue("primary");

  return (
    <View style={[styles.guideCard, { backgroundColor: cardBackgroundColor }]}>
      <TouchableOpacity style={styles.header} onPress={onPress}>
        <View style={{ flex: 1 }}>
          <ThemedText style={[styles.guideTitle, { color: headingColor }]}>
            {item.title}
          </ThemedText>
          {!isExpanded && (
            <View style={styles.tagsRow}>
              <Tag
                text={item.difficulty}
                color={tagTextColor}
                backgroundColor={tagBgColor}
              />
            </View>
          )}
        </View>
        <ChevronDown
          color={headingColor}
          style={{ transform: [{ rotate: isExpanded ? "180deg" : "0deg" }] }}
        />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.content}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.guideImage}
            transition={300}
          />

          <InfoSection
            title="Princípio de Funcionamento"
            content={item.principle}
            icon={Puzzle}
            color={primaryColor}
          />
          <InfoSection
            title="Dica Rápida"
            content={item.quickTip}
            icon={Lightbulb}
            color={primaryColor}
          />
          <InfoSection
            title="Aplicações Comuns"
            content={item.applications}
            icon={FlaskConical}
            color={primaryColor}
          />
          <InfoSection
            title="Materiais Necessários"
            content={item.materials}
            icon={Wrench}
            color={primaryColor}
          />
          <InfoSection
            title="Instruções de Montagem"
            content={item.instructions}
            icon={ListChecks}
            color={primaryColor}
          />

          <View
            style={[styles.linksSection, { borderTopColor: separatorColor }]}>
            {item.links.map((link, i) => (
              <TouchableOpacity
                key={i}
                style={styles.linkContainer}
                onPress={() => Linking.openURL(link.url)}>
                <ExternalLink color={textColor} size={16} />
                <ThemedText style={[styles.linkText, { color: textColor }]}>
                  {link.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

// --- Tela Principal ---
export default function QuickGuideScreen() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <ScreenLayout>
      <TitleSection
        title="Guia de Projetos"
        subtitle="Construa seu próprio espectrofotômetro"
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {quickGuideContent.map((step, index) => (
          <AccordionItem
            key={index}
            item={step}
            isExpanded={expandedIndex === index}
            onPress={() => handleToggle(index)}
          />
        ))}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Informações adaptadas do "Manual de Espectrofotômetros 3D" e artigos
            científicos para fins educacionais.
          </ThemedText>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  scrollViewContent: { padding: Padding.md },
  guideCard: {
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Padding.lg,
    marginBottom: Margin.lg,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Padding.lg,
  },
  guideTitle: {
    fontSize: FontSize.lg,
    fontWeight: "600",
  },
  tagsRow: {
    flexDirection: "row",
    marginTop: Margin.xs,
  },
  content: {
    paddingBottom: Padding.lg,
  },
  guideImage: {
    width: "100%",
    height: 180,
    borderRadius: BorderRadius.md,
    marginBottom: Margin.xl,
    backgroundColor: "#f0f0f0",
  },
  tag: {
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Padding.sm,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  tagText: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
  },
  infoSectionContainer: {
    flexDirection: "row",
    marginBottom: Margin.lg,
  },
  infoIcon: {
    marginRight: Margin.md,
    marginTop: 3,
  },
  subHeader: {
    fontSize: FontSize.md,
    fontWeight: "bold",
    marginBottom: Margin.xs,
  },
  listItem: {
    fontSize: FontSize.md,
    lineHeight: 22,
  },
  linksSection: {
    marginTop: Margin.lg,
    borderTopWidth: 1,
    paddingTop: Padding.md,
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Padding.sm,
  },
  linkText: {
    fontSize: FontSize.md,
    marginLeft: Margin.sm,
    textDecorationLine: "underline",
  },
  footer: {
    padding: Padding.lg,
  },
  footerText: {
    textAlign: "center",
    fontSize: FontSize.sm,
    fontStyle: "italic",
    opacity: 0.7,
  },
});
