export const TYPE_META = {
  yesno: { label: "Yes / No", Icon: Scale },
  single: { label: "Single Choice", Icon: List },
  rating: { label: "Rating", Icon: Star },
  image: { label: "Image", Icon: Image },
  open: { label: "Open Ended", Icon: MessageSquare },
};

export const FILTERS = [
  { key: "all", label: "All", Icon: Sparkles },
  ...Object.entries(TYPE_META).map(([key, v]) => ({
    key,
    label: v.label,
    Icon: v.Icon,
  })),
];